/** @format */

import { createLimiter } from "../utils/core/create-limiter";
import { BlogModel } from "../models/blog.model";
import CommentModel from "../models/comment.model";
import AppError from "../utils/error/app-error";
import catchAsync from "../utils/error/catch-async";
import { Types } from "mongoose";

export const createCmtLimiter = createLimiter({
  max: 5,
  message: "Too many comments. Please slow down.",
  windowMs: 60 * 1000,
});

export const updateCmtLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 100, // 1 min
  message: "Too many request. Please try again later",
});

export const deleteCmtLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 100, // 1 min
  message: "Too many request. Please try again later",
});

export const validateCmtConstraints = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const { parentId } = req.body;

  // query
  const [post, parentCmt] = await Promise.all([
    BlogModel.findById(blogId),
    CommentModel.findById(parentId),
  ]);

  // Validate Blog Existence
  if (!post) {
    throw new AppError("Blog not found", 404);
  }

  // Validate Parent Comment Context if applicable
  if (parentId) {
    if (!parentCmt) {
      throw new AppError("Parent comment not found", 404);
    }

    if (parentCmt?.blogId.toString() !== blogId) {
      throw new AppError(
        "blogId must be the same as parent comment's blogId",
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
