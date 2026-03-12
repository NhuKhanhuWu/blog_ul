/** @format */

import { Request } from "express";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import UserModel from "../../model/userModel";

function getUpdateData(req: Request) {
  const updateData: Record<string, string> = {};

  if (
    typeof req.body?.avatar === "string" &&
    req.body.avatar?.trim().length > 0
  ) {
    updateData.avatar = req.body.avatar.trim();
  }

  if (typeof req.body?.name === "string" && req.body.name?.trim().length > 0) {
    updateData.name = req.body.name.trim();
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError("Avatar or username required.", 400);
  }

  return updateData;
}

// user can change user name, avatar with this controller
export const updateMe = catchAsync(async (req, res) => {
  const updateData = getUpdateData(req);

  const user = await UserModel.findByIdAndUpdate(req.user?._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User update successfully.",
    user,
  });
});
