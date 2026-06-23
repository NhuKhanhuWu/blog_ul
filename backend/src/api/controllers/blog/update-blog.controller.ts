/** @format */

// TODO: update to delete old img & add new img in supabase

import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";

export const updateBlog = catchAsync(async (req, res) => {
  // get blog
  const blogId = req.params.id;

  // update blog
  const updatedBlog = await BlogModel.findOneAndUpdate(
    { _id: blogId, userId: req.user?._id },
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedBlog)
    throw new AppError(
      "Blog not found or you are not authorized to update this blog",
      404,
    );

  // respond
  res.status(200).json({
    status: "success",
    data: updatedBlog,
  });
});
