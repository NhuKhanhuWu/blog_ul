/** @format */

import mongoose, { Types } from "mongoose";
import { BlogModel } from "../../models/blog.model";
import ApiQueryHelper from "../../utils/core/api-query-helper";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import VoteModel from "../../models/vote.model";
import { Request } from "express";
import { BlogWithVote } from "../../types/blog.type";

// interface
type BlogMatchCriteria = { _id: string | Types.ObjectId } | { slug: string };

// -------------constants-------------
// Fields to project (return to client)
const SELECTED_FIELDS = {
  _id: 1,
  title: 1,
  authors: 1,
  pub_date: 1,
  slug: 1,
  upVotes: 1,
  userId: 1,
  preview: { $arrayElemAt: ["$content", 0] },
  image: { $arrayElemAt: ["$images", 0] },
};

// Fields allowed for sorting
const SORT_FIELDS = [
  "-updatedAt", // newest/oldest
  "updatedAt",
  "-upVotes", // alphabetical"title",
];

// Fields allowed for filtering
const FILTER_FIELDS = [
  "updatedAt", // filter by date range
  "userId", // filter by user
];
// -------------constants-------------

// -------------helpers-------------
function applyCategoryFilter(
  baseQuery: mongoose.Query<any, any>,
  queryObject: Record<string, any>,
) {
  const categories = queryObject.categories as string | undefined;
  if (!categories) return baseQuery;

  const values = categories
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const logic = queryObject.logic ?? "or";

  if (!["or", "and"].includes(logic)) {
    throw new AppError("Logic must be either 'or' or 'and'", 400);
  }

  // Validate ObjectId
  const categoryIds = values.map((id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid category id: ${id}`, 400);
    }
    return new mongoose.Types.ObjectId(id);
  });

  // Apply filter
  if (logic === "and") {
    baseQuery.find({ categories: { $all: categoryIds } });
  } else {
    baseQuery.find({ categories: { $in: categoryIds } });
  }

  delete queryObject.categories;
  delete queryObject.logic;

  return baseQuery;
}

function getPipeline(
  criteria: BlogMatchCriteria,
  currentUserId?: string | Types.ObjectId,
) {
  const matchStage: Record<string, any> = {};

  if ("_id" in criteria && criteria._id) {
    matchStage._id =
      typeof criteria._id === "string"
        ? new Types.ObjectId(criteria._id)
        : criteria._id;
  } else if ("slug" in criteria) {
    matchStage.slug = criteria.slug;
  }

  // Define our base pipeline
  const pipeline: any[] = [
    // 1. Target the exact blog document
    { $match: matchStage },

    // 2. Native Join for categories
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      },
    },

    // 3. Native Join for user profile details
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId",
      },
    },

    // 4. Flatten the userId array to an object
    {
      $unwind: {
        path: "$userId",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  // ==========================================
  //  Inject Dynamic Vote Lookup Stage
  // ==========================================
  if (currentUserId) {
    const userObjectId =
      typeof currentUserId === "string"
        ? new Types.ObjectId(currentUserId)
        : currentUserId;

    pipeline.push(
      {
        $lookup: {
          from: "votes", // matches your VoteModel collection name
          let: { blogId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$blogId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
          ],
          as: "userVoteRecord",
        },
      },
      {
        $addFields: {
          // Extract voteType property value from the array object or fall back to 0
          voteType: {
            $ifNull: [{ $arrayElemAt: ["$userVoteRecord.voteType", 0] }, 0],
          },
        },
      },
    );
  } else {
    // If user is not logged in, pass a default value of 0 right away
    pipeline.push({
      $addFields: { voteType: 0 },
    });
  }

  // 5. Final payload projection (Include voteType here)
  pipeline.push({
    $project: {
      title: 1,
      slug: 1,
      content: 1,
      images: 1,
      upVotes: 1,
      voteType: 1, // Added voteType field output
      createdAt: 1,
      updatedAt: 1,
      authors: 1,
      totalCmts: 1,
      "categories.name": 1,
      "categories.slug": 1,
      "categories._id": 1,
      "userId.name": 1,
      "userId.slug": 1,
      "userId.avatar": 1,
    },
  });

  return pipeline;
}
// -------------helpers-------------

// -------------controllers-------------
export const getMultBlog = catchAsync(async (req, res) => {
  const queryObject = { ...req.query };

  //  logic nếu không có categories
  if (!queryObject.categories) {
    delete queryObject.logic;
  }

  // 1. Start base query
  let baseQuery = BlogModel.find();

  // 2. Apply category filter
  baseQuery = applyCategoryFilter(baseQuery, queryObject);

  // 3. Apply common API query helpers
  const queryInstance = new ApiQueryHelper({
    query: baseQuery,
    queryString: queryObject,
  });

  queryInstance
    .findbyUser()
    .searchByTitle()
    .filter(FILTER_FIELDS)
    .sort(SORT_FIELDS, "-updatedAt")
    .limitedFields(SELECTED_FIELDS);

  // Capture the count promise
  const countPromise = queryInstance.paginate();

  // 4. Execute query
  const [blogs, totalResults] = await Promise.all([
    queryInstance.query,
    countPromise,
  ]);
  queryInstance.totalResults = totalResults;
  const amount = blogs.length || 0;

  // 5. Get next page
  const page = Number(queryObject.page) || 0;
  const limit = Number(queryObject.limit) || 20;
  const totalPages = Math.ceil(queryInstance.totalResults / limit);
  const nextPage = page + 1 < totalPages ? page + 1 : undefined;

  res.status(200).json({
    status: "success",
    totalResult: queryInstance.totalResults,
    totalPages,
    nextPage,
    amount,
    data: blogs,
  });
});

// get one blog
const getVoteType = async (req: Request, blogId: Types.ObjectId) => {
  const userId = req.user?._id; // get vote type

  // if user login
  // 1: upVote
  // -1: downVote
  // 0: not vote
  let voteType = 0; // 0 by default
  if (userId) {
    const voteRecord = await VoteModel.findOne({
      userId,
      targetId: blogId,
    });

    if (voteRecord) voteType = voteRecord.voteType;
  }

  return voteType;
};

export const getOneBlogById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user?._id;

  const blogRes = await BlogModel.aggregate(
    getPipeline({ _id: id || "" }, currentUserId),
  );
  const blog = (blogRes[0] || null) as BlogWithVote | null;

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  // add to response

  res.status(200).json({
    status: "success",
    data: blog,
  });
});

export const getOneBlogBySlug = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const currentUserId = req.user?._id;

  const blogRes = await BlogModel.aggregate(
    getPipeline({ slug: slug || "" }, currentUserId),
  );
  const blog = (blogRes[0] || null) as BlogWithVote | null;

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: blog,
  });
});
// -------------controllers-------------
