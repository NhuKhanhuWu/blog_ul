/** @format */

import { Query } from "mongoose";
import CommentModel from "../../model/commentModel";
import ApiQueryHelper from "../../utils/ApiQueryHelper";
import catchAsync from "../../utils/catchAsync";

const SORT_FIELDS = ["createdAt", "-createdAt", "-upVotes"];

const FILTER_FIELDS = ["parentId"];

const getCmt = (baseQuery: Query<any, any>) =>
  catchAsync(async (req, res) => {
    // get blog id & sort request
    const queryObject = { ...req.query };

    // prepare query
    const queryInstance = new ApiQueryHelper({
      query: baseQuery,
      queryString: queryObject,
    });

    queryInstance.filter(FILTER_FIELDS).sort(SORT_FIELDS, "-upVotes");
    await queryInstance.paginate();

    // query
    // TODO: exclude cmt that has been deleted
    const cmt = await queryInstance.query.populate(
      "userId",
      "avatar name slug",
    );
    const amount = cmt.length;

    // get page
    const limit = 20;
    const totalPages = Math.ceil(queryInstance.totalResults / limit);
    const page = Number(queryObject.page) || 0;
    const nextPage = page + 1 < totalPages ? page + 1 : undefined;

    // return
    res.status(200).json({
      status: "success",
      totalResult: queryInstance.totalResults,
      totalPages,
      nextPage,
      amount,
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
