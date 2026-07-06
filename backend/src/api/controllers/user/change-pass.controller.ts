/** @format */

import { Request, Response } from "express";
import UserModel from "../../models/user.model";
import { UserDocument } from "../../types/user.type";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/token/create-token";
import RefreshToken from "../../models/refresh-token.model";

const handleUserSessions = async (
  user: UserDocument,
  req: Request,
  res: Response,
) => {
  const { isLogoutOthers = true } = req.body; //log out by default

  user.passwordChangedAt = new Date(Date.now());

  // if logout in others device
  if (isLogoutOthers) {
    // increase token version
    user.tokenVersion += 1;

    // create new refresh token
    const refreshToken = createRefreshToken(user.id, user.tokenVersion);

    // save token to db
    RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      sessionExpiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
    });

    // save token to cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 20 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }

  // create access token
  const accessToken = createAccessToken(user.id, user.tokenVersion);

  return accessToken;
};

export const changePass = catchAsync(async (req, res) => {
  const { password, passwordConfirm, currentPassword, isLogoutOthers } =
    req.body;
  // const { accessToken } = req;

  // check if data is present
  if (!password || !passwordConfirm || !currentPassword) {
    throw new AppError(
      "Please provide all required fields: password, passwordConfirm, currentPassword",
      400,
    );
  }

  // check if user is present
  const user = await UserModel.findById(req.user?.id).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // check is password is correct
  const isPasswordCorrect = await user?.checkPassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new AppError("Current password is incorrect", 401);
  }

  // check if currentPassword !== password
  if (currentPassword === password) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }

  // check if password===passwordConfirm
  if (password !== passwordConfirm) {
    throw new AppError("Passwords do not match", 400);
  }

  // update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  // update session
  const accessToken = await handleUserSessions(user, req, res);

  await user.save();

  // send response
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
    accessToken,
  });
});
