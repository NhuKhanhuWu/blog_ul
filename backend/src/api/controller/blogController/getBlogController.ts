/** @format */

import mongoose from "mongoose";
import { BlogModel } from "../../model/blogModel";
import ApiQueryHelper from "../../utils/ApiQueryHelper";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { getOne } from "../../utils/crudFactory";

// -------------constants-------------
// Fields to project (return to client)
const SELECTED_FIELDS = {
  _id: 1,
  title: 1,
  authors: 1,
  pub_date: 1,
  slug: 1,
  voteScore: 1,
  preview: { $arrayElemAt: ["$content", 0] },
  image: { $arrayElemAt: ["$images", 0] },
};

// Fields allowed for sorting
const SORT_FIELDS = [
  "pub_date", // newest/oldest
  "-pub_date",
  "-voteScore", // alphabetical"title",
];

// Fields allowed for filtering
const FILTER_FIELDS = [
  "pub_date", // filter by date range
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

  // 🔥 Validate ObjectId
  const categoryIds = values.map((id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid category id: ${id}`, 400);
    }
    return new mongoose.Types.ObjectId(id);
  });

  // 🔥 Apply filter
  if (logic === "and") {
    baseQuery.find({ categories: { $all: categoryIds } });
  } else {
    baseQuery.find({ categories: { $in: categoryIds } });
  }

  delete queryObject.categories;
  delete queryObject.logic;

  return baseQuery;
}

// -------------helpers-------------

// -------------controllers-------------
export const getMultBlog = catchAsync(async (req, res) => {
  const queryObject = { ...req.query };

  //  logic nếu không có categories
  if (!queryObject.categories) {
    delete queryObject.logic;
  }

  // 1. Start base query (KHÔNG còn filter private)
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
    .sort(SORT_FIELDS, "-pub_date")
    .limitedFields(SELECTED_FIELDS);

  await queryInstance.paginate();

  // 4. Execute query
  const blogs = await queryInstance.query;
  const amount = blogs.length || 1;

  res.status(200).json({
    status: "success",
    totalResult: queryInstance.totalResults,
    totalPages: Math.ceil(queryInstance.totalResults / amount),
    amount,
    data: blogs,
  });
});

export const getOneBlogById = catchAsync(async (req, res) => {
  getOne(BlogModel)(req, res);
});

export const getOneBlogBySlug = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const blog = await BlogModel.findOne({ slug: slug });

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: blog,
  });
});
// -------------controllers-------------
