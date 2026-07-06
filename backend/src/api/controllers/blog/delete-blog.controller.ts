/** @format */

// TODO: update to delete img in supabase

import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";

export const deleteBlog = catchAsync(async (req, res) => {
  // delete blog
  const deletedBlog = await BlogModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?._id,
  });

  if (!deletedBlog)
    throw new AppError(
      "Blog not found or you are not authorized to delete this blog",
      404,
    );

  // respond
  res.status(204).json({
    status: "success",
    data: null,
  });
});
