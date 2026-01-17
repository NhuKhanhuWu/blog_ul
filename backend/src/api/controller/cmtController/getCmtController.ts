/** @format */

import { Query } from "mongoose";
import CommentModel from "../../model/commentModel";
import ApiQueryHelper from "../../utils/ApiQueryHelper";
import catchAsync from "../../utils/catchAsync";

const SORT_FIELDS = ["createdAt", "-createdAt", "top_cmt"];

const FILTER_FIELDS = ["userId", "blogId"];

const getCmt = (baseQuery: Query<any, any>) =>
  catchAsync(async (req, res) => {
    // get blog id & sort request
    const queryObject = { ...req.query };

    // prepare query
    const queryInstance = new ApiQueryHelper({
      query: baseQuery,
      queryString: queryObject,
    });

    queryInstance.filter(FILTER_FIELDS).sort(SORT_FIELDS, "createdAt");
    await queryInstance.paginate();

    // query
    const cmt = await queryInstance.query;
    const amount = cmt.length || 1;

    // return
    res.status(200).json({
      status: "success",
      totalResult: queryInstance.totalResults,
      totalPages: Math.ceil(queryInstance.totalResults / amount),
      amount: cmt.length,
      data: cmt,
    });
  });

export const getCmtByBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;

  const baseQuery = CommentModel.find({ blogId, isDeleted: false });
  await getCmt(baseQuery)(req, res, next);
});

// this requires login
export const getCmtByUser = catchAsync(async (req, res, next) => {
  const baseQuery = CommentModel.find({
    userId: req.user?._id,
    isDeleted: false,
  });

  return getCmt(baseQuery)(req, res, next);
});
