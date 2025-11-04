/** @format */

import UserModel from "../../model/userModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { createLimiter } from "../../utils/createLimiter";
import { sendTokenEmail } from "../../utils/email/emailService";
import { changeEmailEmail } from "../../utils/email/emailTemplate";
import getToken from "../../utils/token/getToken";
import signToken from "../../utils/token/signToken";
import verifyToken from "../../utils/token/verifyToken";

// --------------------------- limiters ---------------------------
export const changeEmailLimiterByUser = createLimiter({
  max: 1,
  windowMs: 60 * 1000,
  message:
    "You can only request change email every 1 minute with your account.",
  keyGenerator: (req) => req.user?.id,
});

export const changeEmailLimiterByIP = createLimiter({
  max: 15,
  windowMs: 60 * 60 * 1000,
  message:
    "You can only request change email 15 times every 1 hour with your device.",
  keyGenerator: (req) => req.ip || "",
});

// --------------------------- limiters ---------------------------

// --------------------------- controllers ---------------------------
export const changeEmailController = catchAsync(async (req, res, next) => {
  // check if password and new email are provided
  const { password, newEmail } = req.body;
  if (!password || !newEmail) {
    throw new AppError("Please provide password and new email", 400);
  }

  const userId = req.user?.id;
  const user = await UserModel.findById(userId).select("+password");

  // check if user exists
  if (!user) {
    throw new AppError("User not found", 404);
  }
  // check if password is correct
  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    throw new AppError("Incorrect password", 401);
  }

  // check if new email is not  already in use
  const isEmailInUse = await UserModel.exists({ email: newEmail });
  if (isEmailInUse) {
    throw new AppError("Email is already in use", 409);
  }

  // send reset email
  const token = signToken({ userId: user.id, newEmail }, "10m");
  const message = changeEmailEmail(token);
  await sendTokenEmail(
    {
      email: newEmail,
      subject: "Your email validate link in Blogie",
      htmlMessage: message,
    },
    res,
    next
  );

  // respond
  res.status(200).json({
    status: "success",
    message: "Validate link sent to email!",
  });
});

export const checkChangeEmailController = catchAsync(async (req, res, next) => {
  const token = getToken(req);

  // check if token exists
  if (!token) {
    throw new AppError("Token is missing", 400);
  }

  // verify token
  let decoded;
  try {
    decoded = await verifyToken(token, process.env.JWT_SECRET || "");
  } catch (err) {
    return next(new AppError("Token is invalid or has expired!", 400));
  }

  const { userId, newEmail } = decoded as { userId: string; newEmail: string };

  // update email
  await UserModel.findByIdAndUpdate(userId, { email: newEmail });

  // respond
  res.status(200).json({
    status: "success",
    message: "Email changed successfully!",
  });
});
// --------------------------- controllers ---------------------------
