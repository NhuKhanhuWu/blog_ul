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

// ------- HELPER --------
const fetchCurrentTokenVersion = async (
  userId: string,
): Promise<number | null> => {
  const cacheKey = `user:version:${userId}`;

  try {
    // get from Redis Cache
    const cachedVersion = await redisClient.get(cacheKey);
    if (cachedVersion !== null) {
      return Number(cachedVersion);
    }

    // Cache Miss -> query MongoDB
    const user = await UserModel.findById(userId).select("tokenVersion").lean();
    if (!user) return null;

    const currentVersion = user.tokenVersion || 0;

    // set to Redis for next request
    await redisClient.setEx(
      cacheKey,
      Number(process.env.USER_VERSION_TTL),
      String(currentVersion),
    );
    return currentVersion;
  } catch (err) {
    // Fallback: if Redis has err, try to read from DB
    const user = await UserModel.findById(userId).select("tokenVersion").lean();
    return user ? user.tokenVersion || 0 : null;
  }
};

export const refreshToken = catchAsync(async (req, res, next) => {
  // get refresh token from cookie
  const refreshToken = req.cookies.refreshToken;

  // check if exsist
  if (!refreshToken) {
    throw new AppError("Refresh token required", 401);
  }

  // verify token
  let decode: JwtPayload;
  try {
    decode = verifyToken(
      refreshToken,
      process.env.JWT_SECRET!,
      true,
    ) as JwtPayload;
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }

  // check if token is valid
  const curRefreshToken = await RefreshToken.findOne({
    token: refreshToken,
  }).lean();
  if (!curRefreshToken) {
    throw new AppError("Session revoked or invalid!", 401);
  }

  const currentTokenVersion = await fetchCurrentTokenVersion(decode.id);

  if (currentTokenVersion === null) {
    return next(new AppError("User no longer exists!", 401));
  }

  if (currentTokenVersion !== decode.tokenVersion) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401),
    );
  }

  // check if token has been used (revoked)
  // if (curRefreshToken.revoked)
  //   throw new AppError("Token has already been used", 401);
  // ------------ TURN OFF NEW REFRESH TOKEN WHEN REVOKE: END -------------

  // create new  token
  const { userId } = curRefreshToken;
  const accessToken = createAccessToken(
    userId.toString(),
    currentTokenVersion || 0,
  );

  // ------------ TURN OFF NEW REFRESH TOKEN WHEN REVOKE: START -------------
  // the web have problem where new refresh token is not setted in cookie when the old one revoked
  // now use one refresh token for the entire session
  //TODO: will fix this later

  // const newRefreshToken = createRefreshToken(userId.toString());

  // update in db
  // await Promise.all([
  //   // marke cur token as used
  //   RefreshToken.findByIdAndUpdate(
  //     { _id: curRefreshToken._id },
  //     {
  //       revoked: true,
  //       revokedAt: new Date(),
  //     },
  //   ),

  //   // create new token
  //   RefreshToken.create({
  //     token: newRefreshToken,
  //     userId,
  //     sessionExpiresAt: sessionExpireDate,
  //   }),
  // ]);

  // // save new refresh token to cookie
  // res.cookie("refreshToken", newRefreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   maxAge: 20 * 24 * 60 * 60 * 1000, // 20 days
  //   path: "/",
  // });
  // ------------ TURN OFF NEW REFRESH TOKEN WHEN REVOKE: END -------------

  // send response
  res.status(201).json({
    status: "success",
    accessToken,
  });
});
