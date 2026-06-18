/** @format */

import { BlogListModel } from "../../models/blog-list.model";
import { buildVisibilityFilter } from "../../utils/core/crud-factory";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import { Types } from "mongoose";

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

    // 3. Deconstruct the thumbnailBlog array
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

export const getBlogListById = catchAsync(async (req, res) => {
  // get blog list id & user id
  const blogListId = req.params.id;
  const userId = req.user?.id;

  // find the blog list
  const blogList = await BlogListModel.findById(blogListId);

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
// ------------controllers-------------
