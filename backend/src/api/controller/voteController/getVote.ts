/** @format */

import { Request } from "express";
import { PipelineStage, Types } from "mongoose";
import catchAsync from "../../utils/catchAsync";
import VoteModel from "../../model/voteModel";

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
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  const voteType = req.query.voteType ? Number(req.query.voteType) : undefined;

  const match: any = {
    userId,
    targetType: "blog",
  };
  if (voteType === 1 || voteType === -1) {
    match.voteType = voteType;
  }

  return { page, limit, skip, match };
}

// return pipeline from input
function getPipeline({ limit, skip, match }: IGetPineline): PipelineStage[] {
  const pipeline: PipelineStage[] = [
    { $match: match },

    // sort theo thời gian vote
    { $sort: { createdAt: -1 } },

    // paginate
    { $skip: skip },
    { $limit: limit },

    // join sang blogs
    {
      $lookup: {
        from: "blogs",
        localField: "targetId",
        foreignField: "_id",
        as: "blog",
      },
    },
    { $unwind: "$blog" },

    // chọn field trả về
    {
      $project: {
        _id: "$blog._id",
        title: "$blog.title",
        slug: "$blog.slug",
        excerpt: "$blog.excerpt",
        voteType: 1,
        votedAt: "$createdAt",
      },
    },
  ];

  return pipeline;
}
// -------- HELPER ----------

// -------- CONTROLLER --------
// example request: {{baseUrl}}/user/me/my-vote?page=2&limit=30&voteType=up
export const getUserBlogVote = catchAsync(async (req, res) => {
  // get user id & params
  const { page, limit, skip, match } = getParams(req);
  const pipeline = getPipeline({ limit, skip, match }); // pineline

  // get blog
  const [items, total] = await Promise.all([
    VoteModel.aggregate(pipeline),
    VoteModel.countDocuments(match),
  ]);

  // return
  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items,
  });
});
// -------- CONTROLLER --------
