/** @format */

import UserModel from "../../model/userModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";

export const changePassController = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, currentPassword } = req.body;

  // check if data is present
  if (!password || !passwordConfirm || !currentPassword) {
    throw new AppError("Please provide all required fields", 400);
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
      400
    );
  }

  // check if password===passwordConfirm
  if (password !== passwordConfirm) {
    throw new AppError("Passwords do not match", 400);
  }

  // update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // send response
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});
