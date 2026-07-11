/** @format */

import UserModel from "../../models/user.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import { revokeAndRegenerateTokens } from "../../services/auth.service";

export const changePass = catchAsync(async (req, res) => {
  const { password, passwordConfirm, currentPassword } = req.body;

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

  // update
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = new Date(Date.now());

  // update session
  const accessToken = await revokeAndRegenerateTokens(user, req, res);

  await user.save();

  // send response
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
    accessToken,
  });
});
