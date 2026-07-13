/** @format */

import catchAsync from "../../utils/error/catch-async";
import UserModel from "../../models/user.model";
import AppError from "../../utils/error/app-error";

// user can change user name, avatar with this controller
export const updateMe = catchAsync(async (req, res) => {
  const updateData = req.body;

  const user = await UserModel.findById(req.user?._id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // attach new data
  Object.assign(user, updateData);

  // update
  await user.save();

  res.status(200).json({
    status: "success",
    message: "User update successfully.",
    user,
  });
});
