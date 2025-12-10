/** @format */

import mongoose from "mongoose";
import { BlogModel } from "../../model/blogModel";
import ApiQueryHelper from "../../utils/ApiQueryHelper";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { buildVisibilityFilter, getOne } from "../../utils/crudFactory";

// -------------constants-------------
// Fields to project (return to client)
const SELECTED_FIELDS = "id url title authors categories pub_date slug";

// Fields allowed for sorting
const SORT_FIELDS = [
  "pub_date", // newest/oldest
  "-pub_date",
  "title", // alphabetical"title",
  "-title",
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
  queryObject: Record<string, any>
) {
  const categories = queryObject.categories as string | undefined;
  if (!categories) return baseQuery;

  const values = categories.split(",").map((v) => v.trim());
  const logic = queryObject.logic || "or";

  if (logic !== "or" && logic !== "and") {
    throw new AppError("Logic must be either 'or' or 'and'", 400);
  }

  baseQuery =
    logic === "and"
      ? baseQuery.find({ categories: { $all: values } })
      : baseQuery.find({ categories: { $in: values } });

  // Remove used keys to avoid interfering with ApiQueryHelper
  delete queryObject.categories;
  delete queryObject.logic;

  return baseQuery;
}
// -------------helpers-------------

// -------------controllers-------------
export const getMultBlog = catchAsync(async (req, res) => {
  const queryObject = { ...req.query }; // shallow clone

  // 1. Build base filter (hidden blogs or user's own blogs)
  const filter = buildVisibilityFilter(req);

  // Start base query
  let baseQuery = BlogModel.find(filter);

  // 2. Process categories filtering (if any)
  baseQuery = applyCategoryFilter(baseQuery, queryObject);

  // 3. Pass into API Query Helper
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

  // 4. Execute final query
  const blogs = await queryInstance.query;
  const amount = blogs.length;

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

export const getCategories = catchAsync(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  if (page < 1) {
    throw new AppError("Page number must be greater than 0", 400);
  }

  const skip = (page - 1) * 15;
  const limit = 15;

  const categories = await BlogModel.aggregate([
    { $unwind: "$categories" },
    { $group: { _id: "$categories" } },
    { $sort: { _id: 1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  res.status(200).json({
    status: "success",
    result: categories.length,
    data: categories,
  });
});
// -------------controllers-------------
