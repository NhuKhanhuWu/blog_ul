/** @format */

import { BlogListModel } from "../../models/blog-list.model";
import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";

export const updateBlogList = catchAsync(async (req, res) => {
  const { id: blogListId } = req.params;
  const userId = req.user?.id;
  const { name, description, isPrivate } = req.body;

  const update: any = {};
  if (name !== undefined) update.name = name;
  if (description !== undefined) update.description = description;
  if (isPrivate !== undefined) update.isPrivate = isPrivate;

  if (Object.keys(update).length === 0) {
    return res.status(200).json({ status: "success", data: null });
  }

  const updated = await BlogListModel.findOneAndUpdate(
    { _id: blogListId, userId },
    { $set: update },
    { new: true, runValidators: true },
  );

  if (!updated) {
    throw new AppError("Blog list not found or access denied.", 404);
  }

  res.status(200).json({
    status: "success",
    data: updated,
  });
});

export const addBlogToList = catchAsync(async (req, res) => {
  const { id: blogListId } = req.params;
  const userId = req.user?.id;
  const { blogId } = req.body;

  const blogExists = await BlogModel.exists({ _id: blogId });
  if (!blogExists) {
    throw new AppError("Blog not found.", 404);
  }

  const updatedBlogList = await BlogListModel.findOneAndUpdate(
    { _id: blogListId, userId },
    { $addToSet: { blogs: blogId } },
    { new: true, runValidators: false },
  );

  if (!updatedBlogList) {
    throw new AppError("Blog list not found or access denied.", 404);
  }

  res.status(200).json({
    status: "success",
    data: updatedBlogList,
  });
});

export const removeBlogFromList = catchAsync(async (req, res) => {
  const { id: blogListId, blogId } = req.params;
  const userId = req.user?.id;

  const updatedBlogList = await BlogListModel.findOneAndUpdate(
    { _id: blogListId, userId }, // verify ownership in query
    { $pull: { blogs: blogId } },
    { new: true, runValidators: false }, // skip validators for performance
  );

  if (!updatedBlogList) {
    throw new AppError("Blog list not found or access denied.", 404);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
