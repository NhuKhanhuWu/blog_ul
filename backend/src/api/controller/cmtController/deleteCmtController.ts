/** @format */

import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";

export const softDeleteCmt = catchAsync(async (req, res) => {
  // get cmt
  const cmt = req.cmt;
  if (!cmt) throw new AppError("Comment not found", 404);

  // delete cmt (soft delete)
  cmt.isDeleted = true;
  await cmt.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
