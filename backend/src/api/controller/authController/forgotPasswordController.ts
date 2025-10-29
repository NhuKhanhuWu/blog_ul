/** @format */

import { Request, Response, NextFunction } from "express";
import UserModel from "../../model/userModel";
import catchAsync from "../../utils/catchAsync";
import { sendTokenEmail } from "../../utils/email/emailService";
import { createLimiter } from "../../utils/createLimiter";
import createSendToken from "../../utils/token/createSendToken";
import signToken from "../../utils/token/signToken";
import { resetPasswordEmail } from "../../utils/email/emailTemplate";
import { IUserDocument } from "../../interface/IUser";
import getToken from "../../utils/token/getToken";
import AppError from "../../utils/AppError";
import verifyToken from "../../utils/token/verifyToken";

// ---------------------------
// Rate Limiters
// ---------------------------
// For forgot-password OTP: limit 1 request per 3 mins by email
export const forgotPasswordOtpLimiterEmail = createLimiter({
  max: 1,
  windowMs: 3 * 60 * 1000,
  message:
    "You can only request a password reset once every 3 minutes with this email.",
  keyGenerator: (req) => req.body.email,
});

// For forgot-password OTP: limit 10 request per 1 hour by IP
export const forgotPasswordOtpLimiterIP = createLimiter({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message:
    "You can only request a password reset 10 times every 1 hour with your device.",
  keyGenerator: (req) => req.ip || "",
});

// ---------------------------
// Controllers
// ---------------------------

// FORGOT PASSWORD
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get email
    const { email } = req.body as { email?: string };
    if (!email) return next(new Error("Email required"));

    // 1. get user by email
    const user = (await UserModel.findOne({ email })) as IUserDocument | null;

    // still send success status to prevent attacker from guessing emails
    if (!user) {
      return res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    }

    // 2. create token, expire in 5min
    const token = signToken({ id: user._id }, "5m");

    // 3. send email
    const message = resetPasswordEmail(token);
    await sendTokenEmail(
      {
        email,
        subject: "Your password reset link (valid for 5 mins)",
        htmlMessage: message,
      },
      res,
      next
    );

    // send response
    res.status(200).json({
      status: "success",
      message: "Reset link sent to email!",
    });
  }
);

// check token in the reset password link middleware
export const checkResetPasswordToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get token from request
    const token = getToken(req);
    if (!token) {
      return next(new AppError("Token is missing", 400));
    }

    // verify token
    let decoded;
    try {
      decoded = await verifyToken(token, process.env.JWT_SECRET || "");
    } catch (err) {
      return next(new AppError("Token is invalid or has expired!", 400));
    }

    // get user from token
    const user = await UserModel.findById((decoded as { id: string }).id);
    if (!user) {
      return next(new AppError("The user no longer exists.", 400));
    }

    // attach user to request object
    req.user = user;
    req.body.email = user.email; // attach email to body for resetPassword controller (so user doesn't have to provide it again)
    next();
  }
);

// RESET PASSWORD
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  // 1. get user
  const user = (await UserModel.findOne({
    email: req.body.email,
  })) as IUserDocument;

  // 2. update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = new Date();
  await user.save();

  createSendToken(user, 200, res);
});
