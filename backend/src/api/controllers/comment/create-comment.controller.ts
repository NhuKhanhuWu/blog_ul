/** @format */

import CommentModel from "../../models/comment.model";
import catchAsync from "../../utils/error/catch-async";
import { BlogModel } from "../../models/blog.model";

export const createCmt = catchAsync(async (req, res) => {
  const blogId = req.params.id;
  const { content, parentId } = req.body;
  const parentCmt = req.cmt;

  // create comment
  const comment = await CommentModel.create({
    userId: req.user?._id,
    blogId,
    parentId: parentId || null,
    content,

    upVotes: 0,
    downVotes: 0,
    replyCount: 0,
    isDeleted: false,
  })
    // populate with userId to display in UI
    .then((doc) => doc.populate({ path: "userId", select: "name slug" }));

  // update replyCount
  if (parentCmt) {
    await CommentModel.findByIdAndUpdate(parentId, {
      $inc: { replyCount: 1 },
    });
  }
  // update blog's totalParentCmts
  else
    await BlogModel.findByIdAndUpdate(blogId, {
      $inc: { totalParentCmts: 1 },
    });

  // update blog's totalCmts
  await BlogModel.findByIdAndUpdate(blogId, {
    $inc: { totalCmts: 1 },
  });

  res.status(201).json({
    status: "success",
    data: comment,
  });
});
