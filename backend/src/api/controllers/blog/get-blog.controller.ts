/** @format */

import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import { BlogWithVote } from "../../types/blog.type";
import {
  MY_BLOG_SELECTED_FIELDS,
  MY_BLOG_SORT_FIELDS,
  SELECTED_FIELDS,
  SORT_FIELDS,
  applyCategoryFilter,
  getPipeline,
  sendBlogListResponse,
} from "../../services/blog/get-blog.service";

// -------------controllers-------------
export const getMultBlog = catchAsync(async (req, res) => {
  const queryObject = { ...req.query };

  //  logic nếu không có categories
  if (!queryObject.categories) {
    delete queryObject.logic;
  }

  // 1. Start base query
  let baseQuery = BlogModel.find({
    isDraft: { $ne: true },
    isPrivate: { $ne: true },
  });

  // 2. Apply category filter
  baseQuery = applyCategoryFilter(baseQuery, queryObject);

  await sendBlogListResponse(
    res,
    queryObject,
    baseQuery,
    SELECTED_FIELDS,
    SORT_FIELDS,
    "-pub_date",
  );
});

export const getMyBlogs = catchAsync(async (req, res) => {
  const queryObject = { ...req.query };
  const status = queryObject.status ?? "all";
  const isDraft = queryObject.isDraft;
  delete queryObject.status;
  delete queryObject.isDraft;

  let statusFilter = {};
  if (isDraft !== undefined) {
    statusFilter = { isDraft };
  } else if (status === "draft") {
    statusFilter = { isDraft: true };
  } else if (status === "published") {
    statusFilter = { isDraft: { $ne: true } };
  }
  const baseQuery = BlogModel.find({
    userId: req.user!._id,
    ...statusFilter,
  });

  await sendBlogListResponse(
    res,
    queryObject,
    baseQuery,
    MY_BLOG_SELECTED_FIELDS,
    MY_BLOG_SORT_FIELDS,
    "-updatedAt",
  );
});

// use when user access their blogs (owner)
export const getMyBlogById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user?._id;

  const blogRes = await BlogModel.aggregate(
    getPipeline({ _id: id || "" }, currentUserId, currentUserId),
  );
  const blog = (blogRes[0] || null) as BlogWithVote | null;

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  // add to response
  res.status(200).json({
    status: "success",
    ...blog,
  });
});

export const getOneBlogBySlug = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const currentUserId = req.user?._id;

  const blogRes = await BlogModel.aggregate(
    getPipeline({ slug: slug || "" }, currentUserId),
  );
  const blog = (blogRes[0] || null) as BlogWithVote | null;

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  // check if user is permitted to see this blog
  const blogOwner = blog.userId._id.toString();
  const userId = req.user?._id.toString();

  if (blog.isPrivate && blogOwner !== userId)
    throw new AppError("You are not permitted to view this blog", 403);

  res.status(200).json({
    status: "success",
    data: blog,
  });
});
// -------------controllers-------------
