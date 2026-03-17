/** @format */

import CommentModel from "../../model/commentModel";
import catchAsync from "../../utils/catchAsync";
import { createLimiter } from "../../utils/createLimiter";
import AppError from "../../utils/AppError";
import { Types } from "mongoose";
import { BlogModel } from "../../model/blogModel";
import { Request } from "express";
import { validateCmtConstraints } from "../../services/comment.service";
import { CreateCmtBody, CreateCmtParams } from "../../utils/schema/cmtSchema";

// -------- LIMITERS --------
// 5 cmt/min
export const cmtLimitersPerMin = createLimiter({
  max: 5,
  message: "Too many comments. Please slow down.",
  windowMs: 60 * 1000,
});

// 30 cmt/hour
export const cmtLimitersPerHour = createLimiter({
  max: 30,
  message: "Too many comments. Please slow down.",
  windowMs: 60 * 60 * 1000,
});

// -------- CREATE CONTROLLER --------

export const createCmt = catchAsync(async (req, res) => {
  const { blogId, parentId, content, parentCmt } = await validateCmtConstraints(
    req.params as CreateCmtParams,
    req.body as CreateCmtBody,
  );

  // 4. tạo comment
  const comment = await CommentModel.create({
    userId: req.user?._id,
    blogId,
    parentId: parentId || null,
    content,

    upVotes: 0,
    downVotes: 0,
    replyCount: 0,
    isDeleted: false,
  });

  // 5. update replyCount
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

  // 6. update blog's totalCmts
  await BlogModel.findByIdAndUpdate(blogId, {
    $inc: { totalCmts: 1 },
  });

  res.status(201).json({
    status: "success",
    data: comment,
  });
});
