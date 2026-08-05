/** @format */

import UserModel, { checkUserPassword } from "../../models/user.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import { sendTokenEmail } from "../../utils/email/email-service";
import { changeEmailEmail } from "../../utils/email/email-template";
import { redisClient } from "../../utils/redis";
import { revokeAndRegenerateTokens } from "../../services/auth.service";
import { OtpCache } from "../../types/auth.type";

interface OtpChangeEmail extends OtpCache {
  newEmail: string;
}

// ------ROUTE:  "/change-email"------
export const checkPassAndEmail = catchAsync(async (req, res, next) => {
  const { password, newEmail } = req.body;

  if (!password || !newEmail) {
    throw new AppError("Please provide password and new email", 400);
  }

  const userId = req.user?.id;
  const user = await UserModel.findById(userId).select("+password").lean();

  // check if user exists
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // check if password is correct
  const isPasswordCorrect = await checkUserPassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("Incorrect password", 401);
  }

  // check if new email is not same as current one
  if (user.email === newEmail) {
    throw new AppError("New email must be different from current email", 400);
  }

  // check if new email is not already in use
  const isEmailInUse = await UserModel.exists({ email: newEmail });
  if (isEmailInUse) {
    throw new AppError("Email is already in use", 409);
  }

  next();
});

// update to use otp here & optimize controller
export const changeEmailCreateOtp = catchAsync(async (req, res) => {
  const { newEmail } = req.body;
  const userId = req.user?.id;

  // create otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // save to redis
  const redisKey = `otp:change-email:${userId}`;
  try {
    await redisClient.setEx(
      redisKey,
      Number(process.env.TTL_IN_SECONDS || 10 * 60),
      JSON.stringify({ otp, newEmail, attemps: 0 }),
    );
  } catch (err) {
    throw new AppError("Unable to create OTP, please try again later!", 500);
  }

  // send otp email
  const message = changeEmailEmail(otp);
  await sendTokenEmail({
    email: newEmail,
    subject: "Your email change OTP in Blogie",
    htmlMessage: message,
  });

  // respond
  res.status(200).json({
    status: "success",
    message: "OTP sent to your new email",
  });
});

// ------ROUTE:  "/change-email/verify"------
// 1. Helper: Domain Logic for OTP verification & state management
async function verifyChangeEmailOtp(
  userId: string,
  candidateOtp: string,
): Promise<string> {
  const redisKey = `otp:change-email:${userId}`;
  const redisValue = await redisClient.get(redisKey);

  if (!redisValue) {
    throw new AppError("OTP has expired or never requested", 400);
  }

  const data: OtpChangeEmail = JSON.parse(redisValue);

  // Rate limiting check
  if (data.attempts >= 5) {
    await redisClient.del(redisKey);
    throw new AppError(
      "Too many wrong attempts. Please request a new OTP",
      400,
    );
  }

  // OTP mismatch check
  if (Number(candidateOtp) !== Number(data.otp)) {
    data.attempts += 1;
    const ttl = Number(process.env.TTL_IN_SECONDS || 10 * 60);
    await redisClient.setEx(redisKey, ttl, JSON.stringify(data));
    throw new AppError("Invalid otp", 400);
  }

  // Cleanup OTP after successful verification
  await redisClient.del(redisKey);

  return data.newEmail;
}

// 2. Helper: Domain Logic for safely changing user email
async function updateUserEmail(userId: string, newEmail: string) {
  // 1. Check for duplicates
  const isEmailInUse = await UserModel.exists({ email: newEmail });
  if (isEmailInUse) {
    throw new AppError("Email is already in use by another account", 409);
  }

  try {
    // 2. Perform targeted update
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true, runValidators: true },
    );

    if (!user) throw new AppError("User not found", 404);

    return user;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new AppError("Email is already in use by another account", 409);
    }
    throw error;
  }
}

// 3. Main Express Controller Orchestrator
export const changeEmailOtpVerify = catchAsync(async (req, res, next) => {
  const userId = req.user?.id;
  const { otp: candidateOtp } = req.body;

  if (!candidateOtp) throw new AppError("OTP required", 400);

  if (!userId) {
    throw new AppError("Authentication required. Please log in again.", 401);
  }

  // Verification step
  const newEmail = await verifyChangeEmailOtp(userId, candidateOtp);

  // Database update step
  const user = await updateUserEmail(userId, newEmail);

  // Session / Token update step
  const accessToken = await revokeAndRegenerateTokens(user, req, res, {
    forceLogoutOthers: true,
  });

  res.status(200).json({
    status: "success",
    message: "Email changed successfully!",
    accessToken,
  });
});
