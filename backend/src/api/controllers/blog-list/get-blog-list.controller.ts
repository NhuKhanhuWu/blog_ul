/** @format */

import { BlogListModel } from "../../models/blog-list.model";
import { BlogModel } from "../../models/blog.model";
import { BLOG_LIST_PROJECTION } from "../../services/blog/get-blog.service";
import {
  buildVisibilityFilter,
  getQueryObjectId,
} from "../../utils/core/crud-factory";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import { PipelineStage, Types } from "mongoose";

// ---------- helpers ----------
function buildBlogListPipeline(
  filter: Record<string, unknown>,
  currentBlogId: Types.ObjectId | null,
  publicOnly = false,
): PipelineStage[] {
  const blogLookupPipeline = publicOnly
    ? [
        {
          $match: {
            $expr: { $in: ["$_id", "$$listBlogIds"] },
            isDraft: { $ne: true },
            isPrivate: { $ne: true },
          },
        },
        {
          $addFields: {
            __order: { $indexOfArray: ["$$listBlogIds", "$_id"] },
          },
        },
        { $sort: { __order: 1 as const } },
        { $project: { firstImage: { $arrayElemAt: ["$images", 0] } } },
      ]
    : [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$firstBlogId"] },
          },
        },
        {
          $project: {
            firstImage: { $arrayElemAt: ["$images", 0] },
          },
        },
      ];

  return [
    { $match: filter },

    {
      $lookup: {
        from: "blogs",
        let: {
          firstBlogId: { $arrayElemAt: ["$blogs", 0] },
          listBlogIds: { $ifNull: ["$blogs", []] },
        },
        pipeline: blogLookupPipeline,
        as: publicOnly ? "visibleBlogs" : "thumbnailBlog",
      },
    },

    ...(publicOnly
      ? []
      : [
          {
            $unwind: {
              path: "$thumbnailBlog",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]),

    {
      $project: {
        userId: 1,
        name: 1,
        isPrivate: 1,
        isDefault: 1,

        containsCurrentBlog: currentBlogId
          ? { $in: [currentBlogId, { $ifNull: ["$blogs", []] }] }
          : { $literal: false },

        blogsCnt: publicOnly
          ? { $size: "$visibleBlogs" }
          : { $size: { $ifNull: ["$blogs", []] } },

        listAvatar: {
          $ifNull: [
            publicOnly
              ? { $arrayElemAt: ["$visibleBlogs.firstImage", 0] }
              : "$thumbnailBlog.firstImage",
            null,
          ],
        },
      },
    },
  ];
}

// -------------controllers-------------
export const getMultBlogList = catchAsync(async (req, res) => {
  const targetUserId = getQueryObjectId(req.query.userId, "userId");
  const publicOnly = req.query.publicOnly === "true";

  const currentBlogId = req.query.currentBlogId
    ? getQueryObjectId(req.query.currentBlogId, "currentBlogId")
    : null;

  const filter = buildVisibilityFilter(req, targetUserId);
  if (publicOnly) filter.isPrivate = { $ne: true };

  const pipeline = buildBlogListPipeline(filter, currentBlogId, publicOnly);

  const blogLists = await BlogListModel.aggregate(pipeline);

  res.status(200).json({
    status: "success",
    data: blogLists,
  });
});

export const getBlogListMeta = catchAsync(async (req, res) => {
  const blogListId = req.params.id;
  const userId = req.user?.id;

  const blogList = await BlogListModel.findById(blogListId)
    .select("name userId description isPrivate blogs")
    .lean();
  if (!blogList) throw new AppError("Blog list not found", 404);

  const isOwner = blogList.userId.toString() === userId?.toString();
  if (blogList.isPrivate && !isOwner) {
    throw new AppError(
      "You do not have permission to view this blog list",
      403,
    );
  }

  const blogIds = blogList.blogs ?? [];
  const blogsCnt = isOwner
    ? blogIds.length
    : await BlogModel.countDocuments({
        _id: { $in: blogIds },
        isDraft: { $ne: true },
        isPrivate: { $ne: true },
      });

  res.status(200).json({
    status: "success",
    data: {
      _id: blogList._id,
      name: blogList.name,
      userId: blogList.userId,
      description: blogList.description,
      isPrivate: blogList.isPrivate,
      blogsCnt,
    },
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

  let blogIds: Types.ObjectId[] = [...(blogList.blogs || [])];
  const isOwner = req.user?.id.toString() === blogList.userId.toString();

  if (!isOwner) {
    const visibleBlogs = await BlogModel.find({
      _id: { $in: blogIds },
      isDraft: { $ne: true },
      isPrivate: { $ne: true },
    })
      .select("_id")
      .lean();
    const visibleBlogIds = new Set(
      visibleBlogs.map((blog) => blog._id.toString()),
    );
    blogIds = blogIds.filter((blogId) => visibleBlogIds.has(blogId.toString()));
  }

  const totalBlogs = blogIds.length;

  // Quick escape if the list has no blogs added yet
  if (totalBlogs === 0) {
    return res.status(200).json({
      status: "success",
      totalResult: totalBlogs,
      totalPages: 0,
      amount: 0,
      data: [],
    });
  }

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
    { $project: BLOG_LIST_PROJECTION },
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
