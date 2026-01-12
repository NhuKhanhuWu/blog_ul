/** @format */

import { BlogListModel } from "../../model/blogListModel";
import catchAsync from "../../utils/catchAsync";
import { buildVisibilityFilter } from "../../utils/crudFactory";

const SELECTED_FIELDS = "id userId name description isPrivate";

// -------------controllers-------------
export const getBlogListByUser = catchAsync(async (req, res) => {
  // get filter based on user authentication
  const filter = buildVisibilityFilter(req, res);

  // get blog lists
  const blogLists = await BlogListModel.find(filter).select(SELECTED_FIELDS);

  // respond
  res.status(200).json({
    status: "success",
    data: blogLists,
  });
});

export const getSingleBlogList = catchAsync(async (req, res) => {
  // get blog list id & user id
  const blogListId = req.params.id;
  const userId = req.user?.id;

  // check if blog list exists
  // check if blog list belongs to user
});
// ------------controllers-------------
