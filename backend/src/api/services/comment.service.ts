/** @format */

import { BlogModel } from "../models/blog.model";
import CommentModel from "../models/comment.model";
import AppError from "../utils/error/app-error";
import {
  createCmtBodySchema,
  createCmtParamsSchema,
} from "../validation/comment.validation";
import { Types } from "mongoose";
import catchAsync from "../utils/error/catch-async";

export const validateCmtConstraints = async (
  params: createCmtParamsSchema,
  body: createCmtBodySchema,
) => {
  const blogId = params.id;
  const { content, parentId } = body;

  // 1. Blog phải tồn tại
  const post = await BlogModel.findById(blogId);
  if (!post) {
    throw new AppError("Blog not found", 404);
  }

  // 2. Nếu có parentId: parent comment phải tồn tại và thuộc cùng blog
  let parentCmt = null;
  if (parentId) {
    parentCmt = await CommentModel.findById(parentId);
    if (!parentCmt) {
      throw new AppError("Parent comment not found", 404);
    }

    if (parentCmt.blogId.toString() !== blogId) {
      throw new AppError(
        "blogId must be the same as parent comment's blogId",
        400,
      );
    }
  }

  return { blogId, content, parentId, parentCmt };
};

export const authorizedCmt = catchAsync(async (req, res, next) => {
  // get cmt id
  const cmtId = req.params.id;
  if (!cmtId || !Types.ObjectId.isValid(cmtId))
    throw new AppError("Invalid comment ID", 400);

  // get cmt from db
  const cmt = await CommentModel.findById(new Types.ObjectId(cmtId));

  // check if cmt exsits
  if (!cmt) throw new AppError("Comment not found", 404);

  // check if cmt belongs to user
  if (cmt?.userId.toString() !== req.user?._id.toString())
    throw new AppError("You are not authorized to update this comment", 403);

  // attach cmt
  req.cmt = cmt;

  next();
});
