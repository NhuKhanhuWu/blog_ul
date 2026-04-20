/** @format */

import CommentModel from "../../model/commentModel";
import catchAsync from "../../utils/catchAsync";
import { BlogModel } from "../../model/blogModel";
import { validateCmtConstraints } from "../../services/comment.service";
import { CreateCmtBody, CreateCmtParams } from "../../utils/schema/cmtSchema";

export const createCmt = catchAsync(async (req, res) => {
  const { blogId, parentId, content, parentCmt } = await validateCmtConstraints(
    req.params as CreateCmtParams,
    req.body as CreateCmtBody,
  );

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
