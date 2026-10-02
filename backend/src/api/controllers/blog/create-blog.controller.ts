/** @format */

import { BlogModel } from "../../models/blog.model";
import catchAsync from "../../utils/error/catch-async";

export const createBlog = catchAsync(async (req, res) => {
  const accessToken = req.accessToken;
  const userId = req.user?.id;

  const newBlog = await BlogModel.create({
    userId,
    isDraft: true,
    content: [],
    authors: [],
    categories: [],
  });

  res.status(201).json({
    status: "success",
    data: newBlog,
    accessToken,
  });
});
