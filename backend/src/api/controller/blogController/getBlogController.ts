/** @format */

import { BlogModel } from "../../model/blogModel";
import ApiQueryHelper from "../../utils/ApiQueryHelper";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { getOne } from "../../utils/crudFactory";

// Fields to project (return to client)
const SELECTED_FIELDS = "id url title authors categories pub_date";

// Fields allowed for sorting
const SORT_FIELDS = [
  "pub_date", // newest/oldest
  "-pub_date",
  "title", // alphabetical"title",
  "-title",
];

// Fields allowed for filtering
const FILTER_FIELDS = [
  //   "authors", // filter by author
  "pub_date", // filter by date range
];

export const getMultBlog = catchAsync(async (req, res) => {
  // filter by category first
  const queryObject = { ...req.query }; // shallow clone
  let baseQuery = BlogModel.find();
  const categories = queryObject.categories as string | undefined;

  if (categories) {
    const values = categories.split(",").map((v: string) => v.trim());
    const logic = queryObject.logic || "or";

    // check if logic is valid
    if (logic !== "or" && logic !== "and")
      throw new AppError("Logic must be either 'or' or 'and'", 400);

    baseQuery =
      logic === "and"
        ? baseQuery.find({ categories: { $all: values } })
        : baseQuery.find({ categories: { $in: values } });

    // remove categories and logic from query to avoid issues in ApiQueryHelper
    delete queryObject.categories;
    delete queryObject.logic;
  }

  const queryInstance = new ApiQueryHelper({
    query: baseQuery,
    queryString: queryObject,
  });
  queryInstance
    .search()
    .filter(FILTER_FIELDS)
    .sort(SORT_FIELDS, "-pub_date") // default sort by newest
    .limitedFields(SELECTED_FIELDS);
  await queryInstance.paginate();

  const companies = await queryInstance.query;
  const currAmount = companies.length;

  res.status(200).json({
    status: "success",
    totalResult: queryInstance.totalResults,
    totalPages: Math.ceil(queryInstance.totalResults / currAmount),
    amount: currAmount,
    data: companies,
  });
});

export const getOneBlog = catchAsync(async (req, res) => {
  const id = req.params.id;
  const blog = await BlogModel.findById(id);

  //check if blog exists
  if (!blog) {
    throw new AppError("No blog found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    data: blog,
  });
});

export const getSingleBlog = getOne(BlogModel);
