/** @format */

import CommentModel from "../../model/commentModel";
import catchAsync from "../../utils/catchAsync";
import { createLimiter } from "../../utils/createLimiter";
import AppError from "../../utils/AppError";
import { Types } from "mongoose";
import { BlogModel } from "../../model/blogModel";
import { Request } from "express";

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
const validateParams = async (req: Request) => {
  const blogId = req.params.id;
  const { parentId, content } = req.body;

  // 1. validate blogId
  if (!blogId || !Types.ObjectId.isValid(blogId)) {
    throw new AppError("Invalid blogId", 400);
  }

  // 2. check post tồn tại
  const post = await BlogModel.findById(blogId);
  if (!post) {
    throw new AppError("Blog not found", 404);
  }

  // 3. validate parentId (nếu có)
  let parentCmt = null;
  if (parentId) {
    if (!Types.ObjectId.isValid(parentId)) {
      throw new AppError("Invalid parentId", 400);
    }

    parentCmt = await CommentModel.findById(parentId);
    if (!parentCmt) {
      throw new AppError("Parent comment not found", 404);
    }

    // check if blog Id from child == blog id from parent
    if (parentCmt.blogId.toString() !== blogId) {
      throw new AppError(
        "blogId must be the same as parent comment's blogId",
        400,
      );
    }
  }

  return { blogId, parentId, content, parentCmt };
};

export const createCmt = catchAsync(async (req, res, next) => {
  const { blogId, parentId, content, parentCmt } = await validateParams(req);

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
