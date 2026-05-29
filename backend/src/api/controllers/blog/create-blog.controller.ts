/** @format */

// TODO: update to add new img in supabase

import { BlogModel } from "../../models/blog.model";
import catchAsync from "../../utils/error/catch-async";

export const createBlog = catchAsync(async (req, res, next) => {
  // check blog content
  const accessToken = req.accessToken;

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
