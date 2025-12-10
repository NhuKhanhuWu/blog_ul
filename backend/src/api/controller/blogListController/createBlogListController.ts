/** @format */

import { BlogListModel } from "../../model/blogListModel";
import catchAsync from "../../utils/catchAsync";

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
