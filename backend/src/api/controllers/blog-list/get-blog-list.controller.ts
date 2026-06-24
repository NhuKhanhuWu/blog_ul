/** @format */

import { BlogListModel } from "../../models/blog-list.model";
import { BlogModel } from "../../models/blog.model";
import { buildVisibilityFilter } from "../../utils/core/crud-factory";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import mongoose, { Types } from "mongoose";

// -------------controllers-------------
export const getMultBlogList = catchAsync(async (req, res) => {
  // get filter based on user authentication
  const filter = buildVisibilityFilter(req, res);

  const currentBlogId = (req.query.currentBlogId as string) || "";
  const blogId =
    currentBlogId && Types.ObjectId.isValid(currentBlogId)
      ? new Types.ObjectId(currentBlogId)
      : null;

  // get blog lists
  const blogLists = await BlogListModel.aggregate([
    { $match: filter },

    {
      $lookup: {
        from: "blogs", // Make sure this matches your exact MongoDB collection name for Blogs
        let: { firstBlogId: { $arrayElemAt: ["$blogs", 0] } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$firstBlogId"] } } },
          { $project: { firstImage: { $arrayElemAt: ["$images", 0] } } },
        ],
        as: "thumbnailBlog",
      },
    },

    // Deconstruct the thumbnailBlog array
    {
      $unwind: {
        path: "$thumbnailBlog",
        preserveNullAndEmptyArrays: true, // Keeps lists that don't have any blogs yet
      },
    },

    {
      $project: {
        userId: 1,
        name: 1,
        isPrivate: 1,
        isDefault: 1,

        // create a new field "containsCurrentBlog" to indicate if the current blog is in the list
        containsCurrentBlog: blogId
          ? { $in: [blogId, { $ifNull: ["$blogs", []] }] }
          : { $literal: false },

        // amount of blog in this list
        blogsCnt: { $size: { $ifNull: ["$blogs", []] } },

        listAvatar: {
          $ifNull: ["$thumbnailBlog.firstImage", null],
        },
      },
    },
  ]);

  // respond
  res.status(200).json({
    status: "success",
    data: blogLists,
  });
});

export const getBlogListMeta = catchAsync(async (req, res) => {
  // get blog list id & user id
  const blogListId = req.params.id;
  const userId = req.user?.id;

  // find the blog list
  const [blogList = null] = await BlogListModel.aggregate([
    //  Find the specific blog list
    { $match: { _id: new mongoose.Types.ObjectId(blogListId) } },

    //  Select only the fields needed
    {
      $project: {
        name: 1,
        userId: 1,
        description: 1,
        isPrivate: 1,
        blogsCnt: { $size: { $ifNull: ["$blogs", []] } },
      },
    },
  ]);

  // check if blog list exists
  if (!blogList) throw new AppError("Blog list not found", 404);

  // if private, only owner can view
  if (blogList.isPrivate && blogList.userId.toString() !== userId?.toString()) {
    throw new AppError(
      "You do not have permission to view this blog list",
      403,
    );
  }

  // respond with blog list
  res.status(200).json({
    status: "success",
    data: blogList,
  });
});

export const getBlogFromList = catchAsync(async (req, res) => {
  const { id } = req.params;
  const page = Number(req.params.page) || 0;
  const limit = Number(req.params.limit) || 10;

  // 1. Parse pagination query parameters with safe fallbacks
  const skip = page * limit;

  // 2. Fetch the target Blog List first to check visibility and grab blog IDs
  const blogList = await BlogListModel.findById(id);
  if (!blogList) throw new AppError("Blog list not found", 404);

  // Check if list is private (Optional: Expand this to check req.user.id if authenticated)
  if (
    blogList.isPrivate &&
    req.user?.id.toString() !== blogList.userId.toString()
  ) {
    throw new AppError(
      "You do not have permission to view this blog list",
      403,
    );
  }

  const blogIds = blogList.blogs || [];
  const totalBlogs = blogIds.length;

  // Quick escape if the list has no blogs added yet
  if (totalBlogs === 0) {
    res.status(200).json({
      status: "success",
      totalResult: totalBlogs,
      totalPages: 0,
      amount: 0,
      data: [],
    });
  }

  // 3. Define the aggregation selection layout as requested
  const SELECTED_FIELDS = {
    _id: 1,
    title: 1,
    authors: 1,
    pub_date: 1,
    slug: 1,
    upVotes: 1,
    userId: 1,
    preview: { $arrayElemAt: ["$content", 0] },
    image: { $arrayElemAt: ["$images", 0] },
  };

  // 4. Run aggregation to slice, match, and project specified fields
  // We target the specified subset of IDs relevant to the current page frame
  const targetIdsForPage = blogIds.slice(skip, skip + limit);

  const paginatedBlogs = await BlogModel.aggregate([
    {
      $match: {
        _id: { $in: targetIdsForPage },
      },
    },
    // Keeps the original insertion order from the blogList array
    {
      $addFields: {
        __order: { $indexOfArray: [targetIdsForPage, "$_id"] },
      },
    },
    { $sort: { __order: 1 } },
    { $project: SELECTED_FIELDS },
  ]);

  // 5. Send back pure array context alongside pagination tracking meta
  const totalPages = Math.ceil(totalBlogs / limit);
  res.status(200).json({
    status: "success",
    totalResult: totalBlogs,
    totalPages: Math.ceil(totalBlogs / limit),
    nextPage: page + 1 < totalPages ? page + 1 : null,
    amount: limit,
    data: paginatedBlogs,
  });
});
// ------------controllers-------------
