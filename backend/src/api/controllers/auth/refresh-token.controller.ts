/** @format */

import { JwtPayload } from "../../types/jwt-payload.type";
import RefreshToken from "../../models/refresh-token.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/token/create-token";
import verifyToken from "../../utils/token/verify-token";
import UserModel from "../../models/user.model";
import { redisClient } from "../../utils/redis";
import { NextFunction, Request, Response } from "express";

const DEFAULT_USER_VERSION_TTL = 3600; // 1 hour in seconds
const REFRESH_TOKEN_MAX_AGE = 20 * 24 * 60 * 60 * 1000; // 20 days in milliseconds

/**
 * Fetches current user token version with Cache-aside strategy.
 * Fallbacks directly to MongoDB if Redis encounters an error.
 */
const fetchCurrentTokenVersion = async (
  userId: string,
): Promise<number | null> => {
  const cacheKey = `user:version:${userId}`;

  // Try reading from Redis cache first
  try {
    const cachedVersion = await redisClient.get(cacheKey);
    if (cachedVersion !== null) {
      return Number(cachedVersion);
    }
  } catch (err) {
    console.warn(`[Redis Error] Failed to read key ${cacheKey}:`, err);
  }

  // Cache Miss or Redis failure -> Query MongoDB
  const user = await UserModel.findById(userId).select("tokenVersion").lean();
  if (!user) return null;

  const currentVersion = user.tokenVersion ?? 0;

  // Asynchronously populate Redis cache without blocking the main execution thread
  const ttl = Number(process.env.USER_VERSION_TTL) || DEFAULT_USER_VERSION_TTL;
  redisClient.setEx(cacheKey, ttl, String(currentVersion)).catch((err) => {
    console.warn(`[Redis Error] Failed to set key ${cacheKey}:`, err);
  });

  return currentVersion;
};

/**
 * Extracts and verifies the Refresh Token from incoming cookies.
 */
const verifyRefreshTokenCookie = (req: Request): JwtPayload => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new AppError("Refresh token required", 401);
  }

  try {
    return verifyToken(token, process.env.JWT_SECRET!, true) as JwtPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};

/**
 * Validates token state in Database and handles optional Token Rotation.
 * Token rotation is only executed in Production environment to prevent DB bloat during development.
 */
const processRefreshTokenRotation = async (
  rawToken: string,
  userIdStr: string,
  tokenVersion: number,
) => {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // PRODUCTION: Execute Token Rotation (Atomic Claim & Revoke old token)
    const claimedToken = await RefreshToken.findOneAndUpdate(
      { token: rawToken, revoked: false },
      { $set: { revoked: true, revokedAt: new Date() } },
      { new: true },
    );

    if (!claimedToken) {
      throw new AppError("Token is invalid, revoked, or already used", 401);
    }

    // Generate brand new Refresh Token string
    const newRefreshToken = createRefreshToken(userIdStr, tokenVersion);

    // Save newly rotated Refresh Token into Database
    await RefreshToken.create({
      token: newRefreshToken,
      userId: claimedToken.userId,
      sessionExpiresAt: claimedToken.sessionExpiresAt,
    });

    return newRefreshToken;
  }

  // DEVELOPMENT: Skip Token Rotation to prevent excessive token generation
  const existingToken = await RefreshToken.findOne({
    token: rawToken,
    revoked: false,
  });

  if (!existingToken) {
    throw new AppError("Session revoked or invalid!", 401);
  }

  // Reuse the existing Refresh Token string in Development
  return rawToken;
};

/**
 * Sets the Refresh Token into HTTP-Only response cookie.
 */
const setRefreshTokenCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/",
  });
};

/**
 * Main Refresh Token Controller
 */
export const refreshToken = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const oldRefreshToken = req.cookies?.refreshToken;

    // 1. Verify token signature & payload
    const decoded = verifyRefreshTokenCookie(req);

    // 2. Validate current user existence and security token version
    const currentTokenVersion = await fetchCurrentTokenVersion(decoded.id);

    if (currentTokenVersion === null) {
      throw new AppError("User no longer exists!", 401);
    }

    if (currentTokenVersion !== decoded.tokenVersion) {
      throw new AppError(
        "User recently changed password/email! Please log in again.",
        401,
      );
    }

    // 3. Process token rotation conditional on environment
    const activeRefreshToken = await processRefreshTokenRotation(
      oldRefreshToken,
      decoded.id,
      currentTokenVersion,
    );

    // 4. Generate new Access Token
    const newAccessToken = createAccessToken(decoded.id, currentTokenVersion);

    // 5. Update cookie with active Refresh Token
    setRefreshTokenCookie(res, activeRefreshToken);

    // 6. Send HTTP Response
    res.status(201).json({
      status: "success",
      accessToken: newAccessToken,
    });
  },
);
