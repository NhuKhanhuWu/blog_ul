/** @format */

// TODO: update to delete old img & add new img in supabase

import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import { updateBlogSchema } from "../../validation/blog.validation";

export const updateBlog = catchAsync(async (req, res) => {
  // get blog
  const blogId = req.params.id;
  const user = req.user;
  const blog = await BlogModel.findById(blogId);
  const { accessToken } = req;

  // check if blog exists
  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  // check if user is authorized to update the blog
  if (blog.userId.toString() !== user?.id && user?.role !== "admin") {
    throw new AppError("You are not authorized to update this blog", 403);
  }

  // check if update fields are valid
  const isValid = updateBlogSchema.safeParse(req.body);

  if (!isValid.success) {
    throw new AppError("Invalid blog update data", 400);
  }

  // update blog
  const updatedBlog = await BlogModel.findByIdAndUpdate(
    blogId,
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    },
  );

  // respond
  res.status(200).json({
    status: "success",
    data: updatedBlog,
    accessToken,
  });
});
