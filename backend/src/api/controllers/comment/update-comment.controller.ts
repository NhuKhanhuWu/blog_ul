/** @format */

import catchAsync from "../../utils/error/catch-async";
import AppError from "../../utils/error/app-error";
import CommentModel from "../../models/comment.model";

export const updateCmt = catchAsync(async (req, res) => {
  // check update content
  const content = req.body.content;
  if (!content) throw new AppError("Require updated content", 400);

  // check if cmt exists (to stop ts from complaining)
  const cmt = req?.cmt;
  if (!cmt) throw new AppError("Comment not found", 404);

  // update cmt
  // cmt.content = content;
  // await cmt.save();
  const updatedCmt = await CommentModel.findByIdAndUpdate(
    cmt._id,
    { content },
    {
      new: true,
      runValidators: true,
    },
  );

  // response
  res.status(200).json({
    status: "success",
    data: updatedCmt,
  });
});
