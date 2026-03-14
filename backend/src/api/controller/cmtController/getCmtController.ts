/** @format */
import { Types } from "mongoose";
import CommentModel from "../../model/commentModel";
import catchAsync from "../../utils/catchAsync";

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
}

const getCommentsWithVote = async ({
  filter,
  sort,
  page,
  limit,
  userId,
}: IGetCommentOptions) => {
  const skip = page * limit;
  const sortStage = (SORT_MAP[sort] ?? SORT_MAP[DEFAULT_SORT]) as Record<
    string,
    1 | -1
  >;

  const userObjectId = userId ? new Types.ObjectId(userId) : null;

  const [comments, totalResult] = await Promise.all([
    CommentModel.aggregate([
      // 1. Lọc document theo điều kiện
      { $match: filter },

      // 2. Sắp xếp
      { $sort: sortStage },

      // 3. Bỏ qua n document đầu (phân trang)
      { $skip: skip },

      // 4. Giới hạn số document trả về
      { $limit: limit },

      // 5. Join với collection "votes"
      ...(userObjectId
        ? [
            {
              $lookup: {
                from: "votes", // collection cần join
                // khai báo biến từ document hiện tại
                // để dùng trong pipeline bên dưới
                let: { commentId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      // $expr cho phép so sánh giữa 2 field
                      $expr: {
                        $and: [
                          { $eq: ["$targetId", "$$commentId"] },
                          { $eq: ["$userId", userObjectId] },
                          { $eq: ["$targetType", "comment"] },
                        ],
                      },
                    },
                  },
                  // chỉ lấy field voteType
                  { $project: { voteType: 1, _id: 0 } },
                ],
                // kết quả join lưu vào field "userVote" (là 1 array)
                as: "userVote",
              },
            },

            // 6. Thêm field voteType vào document
            {
              $addFields: {
                voteType: {
                  $ifNull: [
                    // lấy phần tử đầu của array userVote
                    { $first: "$userVote.voteType" },

                    // nếu không có vote → default 0
                    0,
                  ],
                },
              },
            },

            // 7. Xóa field userVote (không cần trả về cho client)
            { $unset: "userVote" },
          ]
        : [{ $addFields: { voteType: 0 } }]),
    ]),

    CommentModel.countDocuments(filter),
  ]);

  return { comments, totalResult };
};

const getCmt = catchAsync(async (req, res) => {
  const userId = req.user?._id?.toString();
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || 20;
  const sort = ALLOWED_SORTS.includes(String(req.query.sort))
    ? String(req.query.sort)
    : DEFAULT_SORT;

  const filter = (req as any)._commentFilter;

  const { comments, totalResult } = await getCommentsWithVote({
    filter,
    sort,
    page,
    limit,
    userId,
  });

  res.status(200).json({
    status: "success",
    totalResult,
    totalPages: Math.ceil(totalResult / limit),
    amount: comments.length,
    data: comments,
  });
});

export const getCmtByBlog = catchAsync(async (req, res, next) => {
  const blogId = new Types.ObjectId(req.params.id);

  (req as any)._commentFilter = {
    blogId, // convert sang ObjectId
    isDeleted: false,
  };

  return getCmt(req, res, next);
});

// this requires login
export const getCmtByUser = catchAsync(async (req, res, next) => {
  const userId = new Types.ObjectId(req.user?._id);

  (req as any)._commentFilter = {
    userId,
    isDeleted: false,
  };

  return getCmt(req, res, next);
});
