/** @format */

import { BlogModel } from "../../model/blogModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";

export const deleteBlog = catchAsync(async (req, res) => {
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
    throw new AppError("You are not authorized to delete this blog", 403);
  }

  // delete blog
  await BlogModel.findByIdAndDelete(blogId);

  // respond
  res.status(204).json({
    status: "success",
    data: null,
    accessToken,
  });
});
