/** @format */

import { BlogListModel } from "../../models/blog-list.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";

export const deleteBlogList = catchAsync(async (req, res) => {
  const { id: blogListId } = req.params;
  const userId = req.user?.id;

  // check if user is able to delete this list
  const target = await BlogListModel.find({ userId, _id: blogListId });
  if (!target) throw new AppError("Blog list not found or access denied.", 404);

  // delete
  await BlogListModel.findByIdAndDelete(blogListId);

  res.status(204).json({
    status: "success",
    daat: null,
  });
});
