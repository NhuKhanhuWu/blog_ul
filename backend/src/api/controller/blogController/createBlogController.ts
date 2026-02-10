/** @format */

// TODO: update to add new img in supabase

import { BlogModel } from "../../model/blogModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { BlogCreateSchema } from "../../utils/schema/blogSchema";

export const createBlog = catchAsync(async (req, res, next) => {
  // check blog content
  const isValid = BlogCreateSchema.safeParse(req.body);
  const accessToken = req.accessToken;

  if (!isValid.success) {
    throw new AppError("Invalid blog data", 400);
  }

  // create blog
  const userId = req.user?.id;
  req.body.userId = userId;
  const newBlog = await BlogModel.create(req.body);

  // respond
  res.status(201).json({
    status: "success",
    data: newBlog,
    accessToken,
  });
});
