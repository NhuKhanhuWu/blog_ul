/** @format */

import { BlogListModel } from "../../models/blog-list.model";
import catchAsync from "../../utils/error/catch-async";

export const createBlogList = catchAsync(async (req, res) => {
  // get user id
  const user = req.user;

  // create blog list
  const newBlogList = await BlogListModel.create({
    ...req.body,
    userId: user?.id,
  });

  res.status(201).json({
    status: "success",
    data: newBlogList,
  });
});
