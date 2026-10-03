/** @format */

import { Request, Response } from "express";
import { PipelineStage, Types } from "mongoose";
import CommentModel from "../../models/comment.model";
import {
  DEFAULT_COMMENT_LIMIT,
  DEFAULT_SORT,
  SORT_MAP,
} from "../../types/comment.type";
import type {
  BuildUserCmtPipelineProps,
  ExtraMetadata,
} from "../../types/comment.type";

const ALLOWED_SORTS = Object.keys(SORT_MAP);

// interface
interface GetCommentOptions {
  filter: Record<string, any>;
  sort: string;
  page: number;
  limit: number;
  userId: string | undefined;
  isFetchUser: boolean;
}

export const getPageAndLimit = (req: Request) => {
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || DEFAULT_COMMENT_LIMIT;

  return {
    page,
    limit,
    skip: page * limit,
  };
};

export const buildUserCmtPipeline = ({
  userObjectId,
  skip,
  limit,
}: BuildUserCmtPipelineProps): PipelineStage[] => [
  {
    $match: {
      userId: userObjectId,
      isDeleted: false,
    },
  },

  // Sort by comment time
  {
    $sort: {
      createdAt: -1,
    },
  },

  // Pagination
  { $skip: skip },
  { $limit: limit },

  // Join to blog
  {
    $lookup: {
      from: "blogs",
      localField: "blogId",
      foreignField: "_id",
      as: "blog",
    },
  },

  // Keep comment even if blog was deleted
  {
    $unwind: {
      path: "$blog",
      preserveNullAndEmptyArrays: true,
    },
  },

  // Response
  {
    $project: {
      _id: 1,
      content: 1,
      blogId: 1,

      title: {
        $ifNull: ["$blog.title", null],
      },

      slug: {
        $ifNull: ["$blog.slug", null],
      },

      createdAt: 1,

      blogExists: {
        $ne: [{ $type: "$blog._id" }, "missing"],
      },
    },
  },
];

// CORE execute function and return Response
// 1. Query Service
export const getCommentsWithVote = async ({
  filter,
  sort,
  page,
  limit,
  userId,
  isFetchUser = true,
}: GetCommentOptions) => {
  const skip = page * limit;
  const sortStage = (SORT_MAP[sort] ?? SORT_MAP[DEFAULT_SORT]) as Record<
    string,
    1 | -1
  >;
  const userObjectId = userId ? new Types.ObjectId(userId) : null;

  const pipeline: PipelineStage[] = [
    { $match: filter },
    // Add a priority sort field (Run only when the user is logged in)
    {
      $addFields: {
        isMyComment: {
          $cond: {
            if: {
              $and: [
                { $not: [{ $eq: [userObjectId, null] }] }, // user logged in
                { $eq: ["$userId", userObjectId] }, // and this cmt belongs to them
              ],
            },
            then: 1, // highest priority
            else: 0, // normal
          },
        },
      },
    },
    { $sort: { isMyComment: -1, ...sortStage } }, // always put log user's cmt first
    { $skip: skip },
    { $limit: limit },
  ];

  // Join with collection votes
  if (userObjectId) {
    pipeline.push(
      {
        $lookup: {
          from: "votes",
          let: { commentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$commentId"] },
                    { $eq: ["$userId", userObjectId] },
                    { $eq: ["$targetType", "comment"] },
                  ],
                },
              },
            },
            { $project: { voteType: 1, _id: 0 } },
          ],
          as: "userVote",
        },
      },
      {
        $addFields: {
          voteType: { $ifNull: [{ $first: "$userVote.voteType" }, 0] },
        },
      },
    );
  } else {
    pipeline.push({ $addFields: { voteType: 0 } });
  }

  // Cleanup project
  pipeline.push({
    $project: { isDeleted: 0, updatedAt: 0, userVote: 0, downVotes: 0 },
  });

  // shorten Lookup Use
  if (isFetchUser) {
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
      // only get neccesary form of Author (userId)
      {
        $project: {
          "userId.password": 0,
          "userId.email": 0,
          "userId.createdAt": 0,
          "userId.updatedAt": 0,
          "userId.role": 0,
          "userId.passwordChangedAt": 0,
          "userId.__v": 0,
          "userId.tokenVersion": 0,
        },
      },
    );
  }

  return await CommentModel.aggregate(pipeline);
};

export const executeAndSendComments = async (
  req: Request,
  res: Response,
  filter: Record<string, any>,
  extraMetadata: ExtraMetadata = {},
  isFetchUser: boolean = true,
) => {
  const userId = req.user?._id?.toString();
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || 20;

  const sort = ALLOWED_SORTS.includes(String(req.query.sort))
    ? String(req.query.sort)
    : DEFAULT_SORT;

  const comments = await getCommentsWithVote({
    filter,
    sort,
    page,
    limit,
    userId,
    isFetchUser,
  });

  // calculate nextPage
  let nextPage = extraMetadata.nextPage;
  if (filter.parentId !== null) {
    nextPage = comments.length === limit ? page + 1 : undefined;
  }

  return res.status(200).json({
    status: "success",
    totalResult: extraMetadata.totalResult,
    totalParentCmts: extraMetadata.totalParentCmts,
    nextPage,
    amount: comments.length,
    data: comments,
  });
};
