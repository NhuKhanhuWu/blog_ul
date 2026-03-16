/** @format */

import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import { BlogModel } from "../../model/blogModel";
import CommentModel from "../../model/commentModel";

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

  // update blog's totalCmts
  await BlogModel.findByIdAndUpdate(cmt.blogId, {
    $inc: { totalCmts: -1 },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
