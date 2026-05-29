/** @format */

import catchAsync from "../../utils/error/catch-async";
import AppError from "../../utils/error/app-error";
import { BlogModel } from "../../models/blog.model";
import CommentModel from "../../models/comment.model";

export const softDeleteCmt = catchAsync(async (req, res) => {
  // get cmt
  const cmt = req.cmt;
  if (!cmt) throw new AppError("Comment not found", 404);

  // delete cmt (soft delete)
  cmt.isDeleted = true;
  await cmt.save();

  // update cmt't parent replyCount
  if (cmt.parentId !== null) {
    await CommentModel.findByIdAndUpdate(cmt.parentId, {
      $inc: { replyCount: -1 },
    });
  }
  // update blog's totalParentCmts
  else
    await BlogModel.findByIdAndUpdate(cmt.blogId, {
      $inc: { totalParentCmts: -1 },
    });

  // update blog's totalCmts
  await BlogModel.findByIdAndUpdate(cmt.blogId, {
    $inc: { totalCmts: -1 },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
