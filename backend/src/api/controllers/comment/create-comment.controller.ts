/** @format */

import CommentModel from "../../models/comment.model";
import catchAsync from "../../utils/error/catch-async";
import { BlogModel } from "../../models/blog.model";

export const createCmt = catchAsync(async (req, res) => {
  const blogId = req.params.id;
  const { content, parentId } = req.body;
  const parentCmt = req.cmt;
  const userId = req.user?._id;

  // create comment
  const comment = await CommentModel.create({
    userId,
    blogId,
    parentId: parentId || null,
    content,

    upVotes: 0,
    downVotes: 0,
    replyCount: 0,
    isDeleted: false,
  });

  // Run write counts and populate adjustments in parallel
  const writeOps: Promise<any>[] = [];

  // update replyCount
  if (parentCmt) {
    // If it's a child reply: Increment its parent's replyCount
    writeOps.push(
      CommentModel.findByIdAndUpdate(parentId, {
        $inc: { replyCount: 1 },
      }),
    );

    // Increment the blog's total count
    writeOps.push(
      BlogModel.findByIdAndUpdate(blogId, { $inc: { totalCmts: 1 } }),
    );
  }

  // If it's a root parent comment
  else {
    writeOps.push(
      BlogModel.findByIdAndUpdate(blogId, {
        // Combined two sequential updates into one operation
        $inc: { totalParentCmts: 1, totalCmts: 1 },
      }),
    );
  }

  // Add the user population step to our concurrent execution thread array
  const populatePromise = comment.populate({
    path: "userId",
    select: "name slug",
  });
  writeOps.push(populatePromise);

  await Promise.all(writeOps);

  res.status(201).json({
    status: "success",
    data: comment,
  });
});
