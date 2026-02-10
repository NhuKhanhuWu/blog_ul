/** @format */

import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";

export const updateCmt = catchAsync(async (req, res) => {
  // check update content
  const content = req.body.content;
  if (!content) throw new AppError("Require updated content", 400);

  // check if cmt exists (to stop ts from complaining)
  const cmt = req?.cmt;
  if (!cmt) throw new AppError("Comment not found", 404);

  // update cmt
  cmt.content = content;
  await cmt.save();

  // response
  res.status(200).json({
    status: "success",
    data: cmt,
  });
});
