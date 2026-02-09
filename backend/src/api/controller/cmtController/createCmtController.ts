/** @format */

import CommentModel from "../../model/commentModel";
import catchAsync from "../../utils/catchAsync";
import { createLimiter } from "../../utils/createLimiter";
import AppError from "../../utils/AppError";
import { Types } from "mongoose";
import { BlogModel } from "../../model/blogModel";

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
export const createCmt = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const { parentId, content } = req.body;

  // 1. validate blogId
  if (!blogId || !Types.ObjectId.isValid(blogId)) {
    return next(new AppError("Invalid blogId", 400));
  }

  // 2. check post tồn tại
  const post = await BlogModel.findById(blogId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // 3. validate parentId (nếu có)
  let parentComment = null;
  if (parentId) {
    if (!Types.ObjectId.isValid(parentId)) {
      return next(new AppError("Invalid parentId", 400));
    }

    parentComment = await CommentModel.findById(parentId);
    if (!parentComment) {
      return next(new AppError("Parent comment not found", 404));
    }

    // check if blog Id from child == blog id from parent
    if (parentComment.blogId.toString() !== blogId) {
      return next(
        new AppError("blogId must be the same as parent comment's blogId", 400)
      );
    }
  }

  // 4. tạo comment
  const comment = await CommentModel.create({
    userId: req.user?._id,
    blogId,
    parentId: parentId || null,
    content,

    voteScore: 0,
    upVotes: 0,
    downVotes: 0,
    replyCount: 0,
    isDeleted: false,
  });

  // 5. update replyCount
  if (parentComment) {
    await CommentModel.findByIdAndUpdate(parentId, {
      $inc: { replyCount: 1 },
    });
  }

  res.status(201).json({
    status: "success",
    data: comment,
  });
});
