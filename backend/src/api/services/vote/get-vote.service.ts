/** @format */

import { PipelineStage, Types } from "mongoose";
import { IGetPineline } from "../../controllers/vote/get-vote.controller";
import { Request } from "express";

// return get blog vote pipeline from input
export function getBlogPipeline({
  limit,
  skip,
  match,
}: IGetPineline): PipelineStage[] {
  const pipeline: PipelineStage[] = [
    { $match: match },

    // 1. Sort by vote time
    { $sort: { createdAt: -1 } },

    // 2. Paginate
    { $skip: skip },
    { $limit: limit },

    // 3. Join to blogs
    {
      $lookup: {
        from: "blogs",
        localField: "targetId",
        foreignField: "_id",
        as: "blog",
      },
    },

    // 4. Keep vote even if blog was deleted
    {
      $unwind: {
        path: "$blog",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 5. Project response
    {
      $project: {
        _id: "$targetId",
        title: {
          $ifNull: ["$blog.title", null],
        },
        slug: {
          $ifNull: ["$blog.slug", null],
        },
        voteType: 1,
        createdAt: 1,

        blogExists: {
          $ne: [{ $type: "$blog._id" }, "missing"],
        },
      },
    },
  ];

  return pipeline;
}

export function getCmtPipeline({
  match,
  skip,
  limit,
}: IGetPineline): PipelineStage[] {
  const pipeline: PipelineStage[] = [
    // 1. Only get votes for comments
    {
      $match: {
        ...match,
        targetType: "comment",
      },
    },

    // 2. Sort by vote time
    { $sort: { createdAt: -1 } },

    // 3. Paginate
    { $skip: skip },
    { $limit: limit },

    // 4. Join to comments
    {
      $lookup: {
        from: "comments",
        localField: "targetId",
        foreignField: "_id",
        as: "comment",
      },
    },

    // Keep vote even if comment was deleted
    {
      $unwind: {
        path: "$comment",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 5. Join comment → blog
    {
      $lookup: {
        from: "blogs",
        localField: "comment.blogId",
        foreignField: "_id",
        as: "blog",
      },
    },

    // Keep record even if blog was deleted
    {
      $unwind: {
        path: "$blog",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 6. Project response
    {
      $project: {
        // Keep original IDs because related document may be deleted
        _id: "$targetId",
        commentId: "$targetId",
        blogId: "$comment.blogId",

        // Blog information
        title: {
          $ifNull: ["$blog.title", null],
        },
        slug: {
          $ifNull: ["$blog.slug", null],
        },

        // Comment information
        commentContent: {
          $ifNull: ["$comment.content", null],
        },

        // Vote metadata
        voteType: 1,
        createdAt: 1,

        // Status
        commentExists: {
          $ne: [{ $type: "$comment._id" }, "missing"],
        },

        blogExists: {
          $ne: [{ $type: "$blog._id" }, "missing"],
        },
      },
    },
  ];

  return pipeline;
}

// get params in request
export function getParams(req: Request) {
  const userId = new Types.ObjectId(req.user?._id);
  const page = Number(req.query.page) || 0;
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = page * limit;
  const voteType = req.query.voteType ? Number(req.query.voteType) : undefined;
  const match: any = {
    userId,
    targetType: "blog",
  };

  if (voteType === 1 || voteType === -1) match.voteType = voteType;

  return { page, limit, skip, match };
}
