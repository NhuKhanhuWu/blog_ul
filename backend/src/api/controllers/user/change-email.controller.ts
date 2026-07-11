/** @format */

import UserModel, { checkUserPassword } from "../../models/user.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import { sendTokenEmail } from "../../utils/email/email-service";
import { changeEmailEmail } from "../../utils/email/email-template";
import { redisClient } from "../../utils/redis";
import { revokeAndRegenerateTokens } from "../../services/auth.service";

interface OtpCache {
  otp: string;
  newEmail: string;
  attempts: number;
}

const TTL_IN_SECONDS = 10 * 60; // 10 mins

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
export const changeEmailOtpStep = catchAsync(async (req, res) => {
  const { newEmail } = req.body;
  const userId = req.user?.id;

  // create otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // save to redis
  const redisKey = `otp:change-email:${userId}`;
  try {
    await redisClient.setEx(
      redisKey,
      TTL_IN_SECONDS,
      JSON.stringify({ otp, newEmail, attemps: 0 }),
    );
  } catch (err) {
    throw new AppError("Unable to create OTP, please try again later!", 500);
  }

  // send otp email
  const message = changeEmailEmail(otp);
  await sendTokenEmail({
    email: newEmail,
    subject: "Your change OTP email in Blogie",
    htmlMessage: message,
  });

  // respond
  res.status(200).json({
    status: "success",
    message: "OTP sent to your new email",
  });
});

export const changeEmailUpdateStep = catchAsync(async (req, res, next) => {
  const userId = req.user?.id;
  const { otp: candidateOtp } = req.body;

  if (!candidateOtp) throw new AppError("OTP required", 400);

  const redisKey = `otp:change-email:${userId}`;
  const redisValue = await redisClient.get(redisKey);

  if (!redisValue)
    throw new AppError("OTP has expired or never requested", 400);

  // check otp
  const data: OtpCache = JSON.parse(redisValue || "");

  // limit 5 attemp for otp
  if (data.attempts >= 5) {
    await redisClient.del(redisKey);
    throw new AppError(
      "Too many wrong attempts. Please request a new OTP",
      400,
    );
  }

  if (Number(candidateOtp) !== Number(data.otp)) {
    data.attempts += 1;
    await redisClient.setEx(redisKey, TTL_IN_SECONDS, JSON.stringify(data));
    throw new AppError("Invalid otp", 400);
  }

  // avoid Race Condition: check if email is used in the last 10 mins
  const isEmailInUse = await UserModel.exists({ email: data.newEmail });
  if (isEmailInUse) {
    await redisClient.del(redisKey);
    throw new AppError("Email is already in use by another account", 409);
  }

  // update email
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.email = data.newEmail;

  // logout from others device (obligatory)
  const accessToken = await revokeAndRegenerateTokens(user, req, res, {
    forceLogoutOthers: true,
  });

  // save user
  await user.save();

  // delete otp from redis
  await redisClient.del(redisKey);

  // respond
  res.status(200).json({
    status: "success",
    message: "Email changed successfully!",
    accessToken,
  });
});
