/** @format */

// TODO: update to delete img in supabase

import { Request } from "express";
import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";

const validate = async (req: Request) => {
  const blogId = req.params.id;
  const user = req.user;
  const blog = await BlogModel.findById(blogId);

  // check if blog exists
  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  // check if user is authorized to update the blog
  if (blog.userId.toString() !== user?.id && user?.role !== "admin") {
    throw new AppError("You are not authorized to delete this blog", 403);
  }

  return blogId;
};

export const deleteBlog = catchAsync(async (req, res) => {
  // get blog
  const blogId = await validate(req);

  // delete blog
  await BlogModel.findByIdAndDelete(blogId);

  // respond
  res.status(204).json({
    status: "success",
    data: null,
  });
});
