/** @format */

import catchAsync from "../../utils/error/catch-async";
import VoteModel from "../../models/vote.model";
import {
  getBlogPipeline,
  getCmtPipeline,
  getParams,
} from "../../services/vote/get-vote.service";

// -------- INTERFACE ---------
export interface IGetPineline {
  limit: number;
  skip: number;
  match: object;
}

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
