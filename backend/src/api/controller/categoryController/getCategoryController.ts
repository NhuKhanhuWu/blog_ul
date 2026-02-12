/** @format */

import { Request } from "express";
import { CategoryModel } from "../../model/categoryModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { PipelineStage } from "mongoose";

interface IGetPipeLine {
  keyword: any;
  limit: number;
  skip: number;
}

const getParam = (req: Request) => {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const keyword = req.query.name;
  if (page < 1) {
    throw new AppError("Page number must be greater than 0", 400);
  }

  const skip = (page - 1) * 15;
  const limit = 15;

  return { keyword, skip, limit };
};

const getPipeline = ({
  keyword,
  limit,
  skip,
}: IGetPipeLine): PipelineStage[] => {
  const pipeline = [
    // Search by name (if there are keywords)
    ...(keyword
      ? [
          {
            $match: {
              name: { $regex: keyword, $options: "i" },
            },
          },
        ]
      : []),

    // Sort by name
    { $sort: { name: 1 } },

    // Paginate + get total count
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },

    // Format output
    {
      $project: {
        data: 1,
        total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
      },
    },
  ] as PipelineStage[];

  return pipeline;
};

export const getCategories = catchAsync(async (req, res) => {
  const { keyword, skip, limit } = getParam(req);
  const pipeline = getPipeline({ keyword, limit, skip });
  const result = await CategoryModel.aggregate(pipeline);

  const categories = result[0]?.data || [];
  const total = result[0]?.total || 0;

  res.status(200).json({
    status: "success",
    totalResult: total,
    data: categories,
  });
});
