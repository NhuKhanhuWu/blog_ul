/** @format */

import { JwtPayload } from "../types/jwt-payload.type";
import AppError from "../utils/error/app-error";
import { createLimiter } from "../utils/core/create-limiter";
import getToken from "../utils/token/get-token";
import verifyToken from "../utils/token/verify-token";
import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model";
import catchAsync from "../utils/error/catch-async";
import { redisClient } from "../utils/redis";

// ----------- HELPERS: START ----------
// Helper: get current tokenVersion of User (Redis Cache first, then Fallback to DB)
const fetchCurrentTokenVersion = async (
  userId: string,
): Promise<number | null> => {
  const cacheKey = `user:version:${userId}`;

  try {
    // try get from Redis Cache
    const cachedVersion = await redisClient.get(cacheKey);
    if (cachedVersion !== null) {
      return Number(cachedVersion);
    }

    // Cache Miss -> query MongoDB
    const user = await UserModel.findById(userId).select("tokenVersion").lean();
    if (!user) return null;

    const currentVersion = user.tokenVersion || 0;

    // cache to Redis for later
    await redisClient.setEx(
      cacheKey,
      Number(process.env.USER_VERSION_TTL),
      String(currentVersion),
    );
    return currentVersion;
  } catch (err) {
    // console.error("Redis/DB Error trong fetchCurrentTokenVersion:", err);

    // Fallback: if Redis err, read from DB
    const user = await UserModel.findById(userId).select("tokenVersion").lean();
    return user ? user.tokenVersion || 0 : null;
  }
};
// ----------- HELPERS: END ----------

// ----------- VERIFY USER: START -----------
export const loadUser = (req: Request, _res: Response, next: NextFunction) => {
  const accessToken = getToken(req);

  if (!accessToken) return next();

  try {
    // try Access Token
    const decode = verifyToken(
      accessToken,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    req.user = {
      id: String(decode.id), // Supports controllers reading string format
      _id: new Types.ObjectId(decode.id as string), // Supports controllers running Mongoose queries
    };
  } catch (err: any) {
    return next();
  }

  next();
};

export const protect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    // get token and check it's there
    const accessToken = getToken(req);

    if (!accessToken) {
      return next(new AppError("Not authenticated!", 401));
    }

    // check if token expired
    let decoded: JwtPayload;
    try {
      decoded = verifyToken(accessToken, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      return next(new AppError("Invalid or expired token", 401));
    }

    const currentVersion = await fetchCurrentTokenVersion(decoded.id);

    if (currentVersion === null) {
      throw new AppError("User no longer exists!", 401);
    }

    if (currentVersion !== decoded.tokenVersion) {
      throw new AppError(
        "User recently changed password! Please log in again.",
        401,
      );
    }

    // attach user to request object
    req.user = {
      id: String(decoded.id), // Supports controllers reading string format
      _id: new Types.ObjectId(decoded.id as string), // Supports controllers running Mongoose queries
    };

    next();
  },
);
// ----------- VERIFY USER: END -----------

// ----------- RATE LIMITER: START -----------
// ----------- forgot pass -----------
export const forgotPasswordOtpLimiterEmail = createLimiter({
  max: 1,
  windowMs: 60 * 1000,
  message:
    "You can only request a password reset once every 1 minute with this email.",
  keyGenerator: (req) => req.body.email.toLowerCase().trim(),
});

// For forgot-password OTP: limit 15 request per 1 hour by IP
export const forgotPasswordOtpLimiterDevice = createLimiter({
  max: 15,
  windowMs: 60 * 60 * 1000,
  message:
    "You can only request a password reset 15 times every 1 hour with your device.",
  keyGenerator: (req) => req.ip || "",
});

export const forgotPasswordVerifyOtpLimiter = createLimiter({
  max: 20,
  windowMs: 5 * 60 * 1000,
  message: "Too many attempts from this device. Please try again later.",
});

// ----------- login -----------
export const loginLimiter = createLimiter({
  max: 5,
  windowMs: 15 * 60 * 1000, //15 min
  message: "You try to login too many times. Please try again after 15 minutes",
});

// ----------- logout -----------
export const logoutLimiter = createLimiter({
  max: 10,
  windowMs: 60 * 1000, //1 min
});

// ----------- refresh token -----------
export const refreshLimiter = createLimiter({
  max: 20,
  windowMs: 5 * 60 * 1000,
});

// ----------- signup -----------
export const signupEmailLimiter = createLimiter({
  max: 1, // 1 request
  windowMs: 60 * 1000, // 1 min,
  message:
    "You can only request signup OTP once every 1 minute with this email.",
  keyGenerator: (req) => req.body.email,
});

export const signupIpLimiter = createLimiter({
  max: 30, // 15 request
  windowMs: 60 * 60 * 1000, // 1 hour,
  message:
    "You can only request signup OTP 15 times every 1 hour with this IP.",
});
// ----------- RATE LIMITER: END -----------
