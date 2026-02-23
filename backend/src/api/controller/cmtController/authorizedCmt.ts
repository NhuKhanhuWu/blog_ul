/** @format */

import { Types } from "mongoose";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import CommentModel from "../../model/commentModel";

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
