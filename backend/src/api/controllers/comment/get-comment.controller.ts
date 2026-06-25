/** @format */
import { PipelineStage, Types } from "mongoose";
import CommentModel from "../../models/comment.model";
import catchAsync from "../../utils/error/catch-async";
import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import { Request, Response } from "express";

// Metadata để quản lý type-safety
interface ExtraMetadata {
  totalCmts?: number;
  totalParentCmts?: number;
  nextPage?: number | null;
}

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  top: { upVotes: -1 },
};

const DEFAULT_SORT = "top";
const ALLOWED_SORTS = Object.keys(SORT_MAP);

interface GetCommentOptions {
  filter: Record<string, any>;
  sort: string;
  page: number;
  limit: number;
  userId: string | undefined;
  isFetchUser: boolean;
}

// 1. Query Service
const getCommentsWithVote = async ({
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
        },
      },
    );
  }

  return await CommentModel.aggregate(pipeline);
};

// 2. CORE execute function and return Response
const executeAndSendComments = async (
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
    totalCmts: extraMetadata.totalCmts,
    totalParentCmts: extraMetadata.totalParentCmts,
    nextPage,
    amount: comments.length,
    data: comments,
  });
};

// 3. API Endpoints (Controllers)
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
    totalCmts: blog.totalCmts || 0,
    totalParentCmts: blog.totalParentCmts || 0,
    nextPage: nextPage ?? null,
  };

  await executeAndSendComments(req, res, filter, extraMetadata, true);
});

export const getCmtByUser = catchAsync(async (req: Request, res, next) => {
  const userId = new Types.ObjectId(req.user?._id);

  const filter = {
    userId,
    isDeleted: false,
  };

  // when get my cmt (/my-cmt), does not need to fetch user profile
  const isFetchUser = req.path.includes("my-cmt") ? false : true;

  await executeAndSendComments(req, res, filter, {}, isFetchUser);
});
