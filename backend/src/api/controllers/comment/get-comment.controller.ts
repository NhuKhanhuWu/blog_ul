/** @format */
import { PipelineStage, Types } from "mongoose";
import CommentModel from "../../models/comment.model";
import catchAsync from "../../utils/error/catch-async";
import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import { Request } from "express";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  top: { upVotes: -1 },
};

const DEFAULT_SORT = "top";
const ALLOWED_SORTS = Object.keys(SORT_MAP);

interface IGetCommentOptions {
  filter: Record<string, any>;
  sort: string;
  page: number;
  limit: number;
  userId?: string | undefined;
  isFetchUser: boolean;
}

const getCommentsWithVote = async ({
  filter,
  sort,
  page,
  limit,
  userId,
  isFetchUser = true,
}: IGetCommentOptions) => {
  const skip = page * limit;
  const sortStage = (SORT_MAP[sort] ?? SORT_MAP[DEFAULT_SORT]) as Record<
    string,
    1 | -1
  >;

  const userObjectId = userId ? new Types.ObjectId(userId) : null;

  const pipeline: PipelineStage[] = [
    // filter document
    { $match: filter },

    // sort
    { $sort: sortStage },

    // skip document
    { $skip: skip },

    // limit document
    { $limit: limit },

    // Join with collection "votes"
    // if user login
    //    + if upvote: voteType: 1
    //    + if downvote: voteType: -1
    // if not login/user does not vote: voteType: 0
    ...(userObjectId
      ? [
          {
            $lookup: {
              from: "votes", // collection need to join
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
                // only get field voteType
                { $project: { voteType: 1, _id: 0 } },
              ],
              // save result to userVote variable (as an array)
              as: "userVote",
            },
          },

          // add field voteType to document
          {
            $addFields: {
              voteType: {
                $ifNull: [
                  // get the first element of array userVote
                  { $first: "$userVote.voteType" },

                  // if does not vote → default 0
                  0,
                ],
              },
            },
          },
        ]
      : [{ $addFields: { voteType: 0 } }]),

    // remove unnecessery fields
    {
      $project: {
        isDeleted: 0,
        updatedAt: 0,
        userVote: 0,
        downVotes: 0,
      },
    },
  ];

  // if need to fetch user infor to cmt
  if (isFetchUser) {
    pipeline.push(
      {
        $lookup: {
          from: "users",
          let: { user_id: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
            { $project: { name: 1, slug: 1, avatar: 1 } },
          ],
          as: "userId",
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
    );
  }

  const comments = await CommentModel.aggregate(pipeline);

  return comments;
};

const getCmt = catchAsync(async (req, res) => {
  const userId = req.user?._id?.toString();
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || 20;

  const sort = ALLOWED_SORTS.includes(String(req.query.sort))
    ? String(req.query.sort)
    : DEFAULT_SORT;

  const filter = (req as any)._commentFilter;
  const extraMetadata = (req as any)._extraMetadata || {}; // get extra data (if there is)
  const isFetchUser = req.path === "/my-cmt" ? false : true;

  const comments = await getCommentsWithVote({
    filter,
    sort,
    page,
    limit,
    userId,
    isFetchUser,
  });

  // cal nextPage
  let nextPage = extraMetadata.nextPage;

  // if replies → no nextPage từ trước
  if (filter.parentId !== null) {
    nextPage = comments.length === limit ? page + 1 : undefined;
  }

  res.status(200).json({
    status: "success",
    totalCmts: extraMetadata.totalCmts,
    totalParentCmts: extraMetadata.totalParentCmts,
    nextPage,
    amount: comments.length,
    data: comments,
  });
});

export const getCmtByBlog = catchAsync(async (req, res, next) => {
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

  // find blog to gett totalCmts and totalParentCmts
  const blog = await BlogModel.findById(blogId)
    .select("totalCmts totalParentCmts")
    .lean(); // use lean for better performance since we only need data and no mongoose document methods

  if (!blog) {
    throw new AppError("Blog not found", 400);
  }

  // setting filter
  (req as any)._commentFilter = {
    parentId,
    blogId,
    isDeleted: false,
  };

  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || 20;

  let nextPage;
  // only calculate next page when this is root cmt (by get totalParentCmts from blog)
  if (parentId === null) {
    const totalPages = Math.ceil(blog.totalParentCmts / limit);
    nextPage = page + 1 < totalPages ? page + 1 : undefined;
  }

  // attach metadata
  req._extraMetadata = {
    totalCmts: blog.totalCmts || 0,
    totalParentCmts: blog.totalParentCmts || 0,
    nextPage, // replies sẽ được set ở getCmt
  };

  return getCmt(req, res, next);
});

// this requires login
export const getCmtByUser = catchAsync(async (req, res, next) => {
  const userId = new Types.ObjectId(req.user?._id);

  req._commentFilter = {
    userId,
    isDeleted: false,
  };

  return getCmt(req, res, next);
});
