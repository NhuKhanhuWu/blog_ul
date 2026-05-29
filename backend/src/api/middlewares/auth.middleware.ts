/** @format */

import { JwtPayload } from "../types/jwt-payload.type";
import UserModel from "../models/user.model";
import AppError from "../utils/error/app-error";
import catchAsync from "../utils/error/catch-async";
import { createLimiter } from "../utils/core/create-limiter";
import getToken from "../utils/token/get-token";
import verifyToken from "../utils/token/verify-token";

// ----------- VERIFY USER: START -----------
export const loadUser = catchAsync(async (req, res, next) => {
  const accessToken = getToken(req);

  if (!accessToken) return next();

  try {
    // try Access Token
    const decoded = verifyToken(
      accessToken,
      process.env.JWT_SECRET!,
    ) as JwtPayload;
    const user = await UserModel.findById(decoded.id);

    // if can get user and password not change after token was issued
    if (user && !user.changedPasswordAfter(decoded.iat!)) {
      req.user = user;
      return next();
    }
  } catch (err: any) {
    return next();
  }

  next();
});

export const protect = catchAsync(async (req, res, next) => {
  //   get token and check it's there
  const accessToken = getToken(req);

  if (!accessToken) {
    return next(new AppError("Not authenticated!", 401));
  }

  // check if token expired
  let decode: JwtPayload;
  try {
    decode = verifyToken(accessToken, process.env.JWT_SECRET!) as JwtPayload;
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }

  // check if user still exsist
  const user = await UserModel.findById(decode.id);

  if (!user) {
    return next(new AppError("Not authenticated", 401));
  }

  if (user.changedPasswordAfter(decode.iat)) {
    return next(new AppError("Password changed. Please login again!", 401));
  }

  req.user = user;
  next();
});
// ----------- VERIFY USER: END -----------

// ----------- RATE LIMITER: START -----------
// ----------- forgot pass -----------
export const forgotPasswordOtpLimiterEmail = createLimiter({
  max: 1,
  windowMs: 60 * 1000,
  message:
    "You can only request a password reset once every 1 minute with this email.",
  keyGenerator: (req) => req.body.email,
}); // For forgot-password OTP: limit 10 request per 1 hour by IP

export const forgotPasswordOtpLimiterIP = createLimiter({
  max: 15,
  windowMs: 60 * 60 * 1000,
  message:
    "You can only request a password reset 15 times every 1 hour with your device.",
  keyGenerator: (req) => req.ip || "",
});

// ----------- login -----------
export const loginLimiter = createLimiter({
  max: 5,
  windowMs: 15 * 60 * 100, //15 min
  message: "You try to login too many times. Please try again after 15 minutes",
});

// ----------- logout -----------
export const logoutLimiter = createLimiter({
  max: 10,
  windowMs: 60 * 100, //1 min
  message: "Too many request. Please try again later.",
});

// ----------- refresh token -----------
export const refreshLimiter = createLimiter({
  max: 20,
  windowMs: 5 * 60 * 1000,
  message: "Too many requests. Please try again later.",
  skipSuccessfulRequests: true,
});

// ----------- signup -----------
export const signupEmailLimiter = createLimiter({
  max: 1, // 1 request
  windowMs: 60 * 1000, // 3 mins,
  message:
    "You can only request signup OTP once every 1 minute with this email.",
  keyGenerator: (req) => req.body.email,
});

export const signupIpLimiter = createLimiter({
  max: 15, // 15 request
  windowMs: 60 * 60 * 1000, // 1 hour,
  message:
    "You can only request signup OTP 15 times every 1 hour with this IP.",
});
// ----------- RATE LIMITER: END -----------
