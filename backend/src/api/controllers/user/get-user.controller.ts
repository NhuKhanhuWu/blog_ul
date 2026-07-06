/** @format */

import UserModel from "../../models/user.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
const GET_BY_SLUG_FIELDS = {
  name: 1,
  slug: 1,
  avatar: 1,
};

export const getMe = catchAsync(async (req, res) => {
  // get user from req object
  const user = await UserModel.findById(req.user?._id).select(
    "_id name email slug passwordChangedAt createdAt",
  );

  // send response
  res.status(200).json({
    status: "success",
    user,
  });
});

export const getUserBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;

  if (!slug) throw new AppError("User's slug required!", 400);

  const user = await UserModel.find({ slug }).select(GET_BY_SLUG_FIELDS);

  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({
    status: "success",
    data: user,
  });
});
