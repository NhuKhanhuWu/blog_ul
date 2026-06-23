/** @format */

import { JwtPayload } from "../types/jwt-payload.type";
import AppError from "../utils/error/app-error";
import { createLimiter } from "../utils/core/create-limiter";
import getToken from "../utils/token/get-token";
import verifyToken from "../utils/token/verify-token";
import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";

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

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  // get token and check it's there
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

  // Trust the JWT: Construct req.user from the payload instead of hitting the DB
  req.user = {
    id: String(decode.id), // Supports controllers reading string format
    _id: new Types.ObjectId(decode.id as string), // Supports controllers running Mongoose queries
  };

  next();
};
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
  windowMs: 15 * 60 * 1000, //15 min
  message: "You try to login too many times. Please try again after 15 minutes",
});

// ----------- logout -----------
export const logoutLimiter = createLimiter({
  max: 10,
  windowMs: 60 * 1000, //1 min
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
