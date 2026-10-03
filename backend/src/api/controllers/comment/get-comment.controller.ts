/** @format */
import { Types } from "mongoose";
import CommentModel from "../../models/comment.model";
import catchAsync from "../../utils/error/catch-async";
import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import { Request } from "express";
import {
  buildUserCmtPipeline,
  executeAndSendComments,
  getPageAndLimit,
} from "../../services/comment/get-comment.service";
import { ExtraMetadata } from "../../types/comment.type";

// API Endpoints (Controllers)
export const getCmtByBlog = catchAsync(async (req: Request, res, next) => {
  const blogIdStr = req.params.id || "";
  const parentIdStr = req.query.parentId;

  if (!Types.ObjectId.isValid(blogIdStr)) {
    throw new AppError("Invalid Blog ID", 400);
  }

  const blogId = new Types.ObjectId(blogIdStr);
  const parentId =
    typeof parentIdStr === "string" && Types.ObjectId.isValid(parentIdStr)
      ? new Types.ObjectId(parentIdStr)
      : null;

  // get count fields from Blog (Lean optimization)
  const blog = await BlogModel.findById(blogId)
    .select("totalCmts totalParentCmts")
    .lean();

  if (!blog) {
    throw new AppError("Blog not found", 400);
  }

  const filter = { parentId, blogId, isDeleted: false };
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || 20;

  let nextPage;
  if (parentId === null) {
    const totalPages = Math.ceil((blog.totalParentCmts || 0) / limit);
    nextPage = page + 1 < totalPages ? page + 1 : undefined;
  }

  const extraMetadata: ExtraMetadata = {
    totalResult: blog.totalCmts || 0,
    totalParentCmts: blog.totalParentCmts || 0,
    nextPage: nextPage ?? null,
  };

  await executeAndSendComments(req, res, filter, extraMetadata, true);
});

export const getCmtByUser = catchAsync(async (req: Request, res, next) => {
  const userId = req.user?._id;

  const { page, limit, skip } = getPageAndLimit(req);
  const userObjectId = new Types.ObjectId(userId);

  const [comments, totalResult] = await Promise.all([
    CommentModel.aggregate(buildUserCmtPipeline({ userObjectId, skip, limit })),
    CommentModel.countDocuments({
      userId: userObjectId,
      isDeleted: false,
    }),
  ]);

  const nextPage = comments.length === limit ? page + 1 : undefined;

  return res.status(200).json({
    status: "success",
    totalResult,
    nextPage,
    amount: comments.length,
    data: comments,
  });
});
