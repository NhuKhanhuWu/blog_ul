/** @format */

import catchAsync from "../../utils/error/catch-async";
import UserModel from "../../models/user.model";
import AppError from "../../utils/error/app-error";
import { createAvatarSignedUploadUrl } from "../../supabase/uploadImages";

export const getAvatarUploadUrl = catchAsync(async (req, res) => {
  const userId = req.user?._id.toString();
  const { fileName } = req.body;

  if (!userId) throw new AppError("Not authenticated!", 401);

  if (!fileName) {
    throw new AppError("fileName is required", 400);
  }

  const uploadData = await createAvatarSignedUploadUrl(userId, fileName);

  res.status(200).json({
    status: "success",
    data: uploadData, // contains signedUrl, token, publicUrl, etc.
  });
});

export const updateMe = catchAsync(async (req, res) => {
  const { username, avatar } = req.body;

  // Build payload with only allowed and provided fields
  const updatePayload: Record<string, any> = {};
  if (username !== undefined) updatePayload.username = username;
  if (avatar !== undefined) updatePayload.avatar = avatar;

  const user = await UserModel.findOneAndUpdate(
    { _id: req.user?._id },
    { $set: updatePayload },
    {
      new: true, // Returns the modified document rather than the original
      runValidators: true, // Enforces schema validation rules on updated fields
      context: "query", // Ensures 'this' context inside custom validators works correctly
    },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully.",
    user,
  });
});
