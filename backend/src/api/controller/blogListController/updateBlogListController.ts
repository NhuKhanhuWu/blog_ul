/** @format */

import { BlogListModel } from "../../model/blogListModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";

export const updateBlogList = catchAsync(async (req, res) => {
  // get user id
  const user = req.user;
  const blogListId = req.params.id;

  //   check if blog list exists
  const blogList = await BlogListModel.findById(blogListId);
  if (!blogList) {
    throw new AppError("Blog list not found.", 404);
  }

  //   check if blog belongs to user
  if (blogList?.userId !== user?.id) {
    throw new AppError(
      "You do not have permission to update this blog list.",
      403
    );
  }

  //   update blog list
  const updatedBlogList = await BlogListModel.findOneAndUpdate(
    { userId: user?.id },
    req.body
  );

  res.status(200).json({
    status: "success",
    data: updatedBlogList,
  });
});
