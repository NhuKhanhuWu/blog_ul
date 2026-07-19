/** @format */

import { Request } from "express";
import { PipelineStage, Types } from "mongoose";
import catchAsync from "../../utils/error/catch-async";
import VoteModel from "../../models/vote.model";

// -------- INTERFACE ---------
interface IGetPineline {
  limit: number;
  skip: number;
  match: object;
}
// -------- INTERFACE ---------

// -------- HELPER ----------
// get params in request
function getParams(req: Request) {
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

// return get blog vote pipeline from input
function getBlogPipeline({
  limit,
  skip,
  match,
}: IGetPineline): PipelineStage[] {
  const pipeline: PipelineStage[] = [
    { $match: match },

    // 1. sort by vote time
    { $sort: { createdAt: -1 } },

    // paginate
    { $skip: skip },
    { $limit: limit },

    // 2. join to blogs
    {
      $lookup: {
        from: "blogs",
        localField: "targetId",
        foreignField: "_id",
        as: "blog",
      },
    },
    { $unwind: "$blog" },

    // 3. project returned data
    {
      $project: {
        _id: "$blog._id",
        title: "$blog.title",
        slug: "$blog.slug",
        voteType: 1,
        createdAt: 1,
      },
    },
  ];

  return pipeline;
}

function getCmtPipeline({ match, skip, limit }: IGetPineline): PipelineStage[] {
  const pipeline: PipelineStage[] = [
    // 1. only get vote for cmt
    {
      $match: {
        ...match,
        targetType: "comment",
      },
    },

    // 2. sort by vote time
    { $sort: { createdAt: -1 } },

    // 3. paginate
    { $skip: skip },
    { $limit: limit },

    // 4. join to comments
    {
      $lookup: {
        from: "comments",
        localField: "targetId", // commentId
        foreignField: "_id",
        as: "comment",
      },
    },
    { $unwind: "$comment" },

    // 5. join from comment to blog
    {
      $lookup: {
        from: "blogs",
        localField: "comment.blogId",
        foreignField: "_id",
        as: "blog",
      },
    },
    { $unwind: "$blog" },

    // 6. project returned data
    {
      $project: {
        _id: "$blog._id",
        title: "$blog.title",
        slug: "$blog.slug",

        // metadata vote
        voteType: 1,
        createdAt: 1,

        // optional (for FE)
        commentId: "$comment._id",
        commentContent: "$comment.content",
      },
    },
  ];

  return pipeline;
}
// -------- HELPER ----------

// -------- CONTROLLER --------
// example request: {{baseUrl}}/user/me/my-blog-vote?page=2&limit=30&voteType=up
export const getUserBlogVote = catchAsync(async (req, res) => {
  // get user id & params
  const { page, limit, skip, match } = getParams(req);
  const pipeline = getBlogPipeline({ limit, skip, match }); // pineline

  // get blog
  const [data, total] = await Promise.all([
    VoteModel.aggregate(pipeline),
    VoteModel.countDocuments(match),
  ]);

  const totalPages = Math.ceil(total / limit);
  const nextPage = page + 1 < totalPages ? page + 1 : undefined;

  // return
  res.status(200).json({
    page,
    limit,
    total,
    totalPages,
    nextPage,
    data,
  });
});

// example request: {{baseUrl}}/user/me/my-cmt-vote?page=2&limit=30&voteType=up
export const getUserCmtVote = catchAsync(async (req, res) => {
  // get user id & params
  const { page, limit, skip, match } = getParams(req);
  const pipeline = getCmtPipeline({ limit, skip, match }); // pineline

  // get blog
  const [data, total] = await Promise.all([
    VoteModel.aggregate(pipeline),
    VoteModel.countDocuments(match),
  ]);

  const totalPages = Math.ceil(total / limit);
  const nextPage = page + 1 < totalPages ? page + 1 : undefined;

  // return
  res.status(200).json({
    page,
    limit,
    total,
    totalPages,
    nextPage,
    data,
  });
});
// -------- CONTROLLER --------
