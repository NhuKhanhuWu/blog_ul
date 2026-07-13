/** @format */

import UserModel from "../../models/user.model";
import catchAsync from "../../utils/error/catch-async";
import { sendTokenEmail } from "../../utils/email/email-service";
import { resetPasswordEmail } from "../../utils/email/email-template";
import AppError from "../../utils/error/app-error";
import { redisClient } from "../../utils/redis";
import crypto from "crypto";

// FORGOT PASSWORD
export const forgotPassword = catchAsync(async (req, res) => {
  // get email
  const { email } = req.body;

  // 1. get user by email
  const isUserExists = await UserModel.exists({ email });

  // still send success status to prevent attacker from guessing emails
  if (!isUserExists) {
    return res.status(200).json({
      status: "success",
      message: "OTP sent to email!",
    });
  }

  // 2. create otp, expire in 5min
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `otp:forgot-password:${email}`;
  try {
    await redisClient.setEx(
      redisKey,
      Number(process.env.TTL_IN_SECONDS || 10 * 60),
      JSON.stringify({ otp, attempts: 0 }),
    );
  } catch (err) {
    throw new AppError("Unable to create OTP, please try again later!", 500);
  }

  // 3. send email
  const message = resetPasswordEmail(otp);
  await sendTokenEmail({
    email,
    subject: "Your password reset OTP in Blogie",
    htmlMessage: message,
  });

  // send response
  res.status(200).json({
    status: "success",
    message: "OTP sended to email",
  });
});

// check token in the reset password link middleware
export const checkResetPasswordToken = catchAsync(async (req, res) => {
  const { email, otp: candidateOtp } = req.body;

  const redisKey = `otp:forgot-password:${email}`;
  const redisOtp = await redisClient.get(redisKey);

  if (!redisOtp) {
    throw new AppError(
      "OTP has expired or never requested. Please try again.",
      400,
    );
  }

  const data = JSON.parse(redisOtp);

  // check if otp valid
  if (String(candidateOtp) !== String(data.otp)) {
    data.attempts += 1;
    await redisClient.setEx(redisKey, 5 * 60, JSON.stringify(data));
    throw new AppError("Invalid OTP", 400);
  }

  // avoid brute-force: wrong over 5 times => delete otp
  if (data.attempts >= 5) {
    await redisClient.del(redisKey);
    throw new AppError(
      "Too many wrong attempts. Please request a new OTP.",
      400,
    );
  }

  // valid otp => delete to avoid reuse
  await redisClient.del(redisKey);

  // create a otken in redis for the next step
  const token = crypto.randomBytes(32).toString("hex");
  const tokenKey = `token:reset-password:${token}`;
  await redisClient.setEx(tokenKey, 5 * 60, email);

  res.status(200).json({
    status: "success",
    message: "OTP verified successfully. You can now reset your password.",
    token,
  });
});

// RESET PASSWORD
export const resetPassword = catchAsync(async (req, res) => {
  const { token, password, passwordConfirm } = req.body;

  // check token
  const redisKey = `token:reset-password:${token}`;
  const email = await redisClient.get(redisKey);

  if (!email) {
    throw new AppError(
      "Reset token is invalid or has expired. Please restart the process.",
      400,
    );
  }

  // get user
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError("User no longer exists", 404);

  // update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = new Date();

  // logout in others devide
  user.tokenVersion += 1;

  await user.save();

  // update tokenVersion in redis
  await redisClient.setEx(
    `user:version:${user._id}`,
    Number(process.env.USER_VERSION_TTL),
    String(user.tokenVersion),
  );

  // response
  res.status(201).json({
    status: "success",
    message: "Password reset successfully!",
  });
});
