/** @format */

import UserModel from "../../model/userModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
const GET_BY_SLUG_FIELDS = {
  name: 1,
  slug: 1,
  avatar: 1,
};

export const getMeController = catchAsync(async (req, res) => {
  // get user from req object
  const user = req.user;
  const { accessToken } = req;

  // send response
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
    accessToken,
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
