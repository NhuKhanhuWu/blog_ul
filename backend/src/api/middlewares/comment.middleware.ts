/** @format */

import { createLimiter } from "../utils/core/create-limiter";
import { BlogModel } from "../models/blog.model";
import CommentModel from "../models/comment.model";
import AppError from "../utils/error/app-error";
import catchAsync from "../utils/error/catch-async";
import { Types } from "mongoose";

export const createCmtLimiter = createLimiter({
  max: 15,
  message: "Too many comments. Please slow down.",
  windowMs: 60 * 1000,
});

export const updateCmtLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 100, // 1 min
});

export const deleteCmtLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 100, // 1 min
});

export const validateCmtConstraints = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const { replyToId } = req.body;

  // query
  const [post, parentCmt] = await Promise.all([
    BlogModel.exists({ _id: blogId }),
    CommentModel.findById(replyToId),
  ]);

  // Validate Blog Existence
  if (!post) {
    throw new AppError("Blog not found", 404);
  }

  // Validate Parent Comment Context if applicable
  if (replyToId) {
    if (!parentCmt) {
      throw new AppError("Parent comment not found", 404);
    }

    if (parentCmt?.blogId?.toString() !== blogId) {
      throw new AppError(
        "blogId must be the same as the comment being replied to",
        400,
      );
    }

    req.cmt = parentCmt;
  }

  next();
});

export const authorizedCmt = catchAsync(async (req, res, next) => {
  // get cmt id
  const cmtId = req.params.id;
  if (!cmtId || !Types.ObjectId.isValid(cmtId))
    throw new AppError("Invalid comment ID", 400);

  // get cmt from db
  const cmt = await CommentModel.findById(new Types.ObjectId(cmtId)).lean();

  // check if cmt exsits
  if (!cmt) throw new AppError("Comment not found", 404);

  // check if cmt belongs to user
  if (cmt?.userId.toString() !== req.user?._id.toString())
    throw new AppError("You are not authorized to update this comment", 403);

  // attach cmt
  req.cmt = cmt;

  next();
});
