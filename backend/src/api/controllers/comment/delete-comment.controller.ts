/** @format */

import catchAsync from "../../utils/error/catch-async";
import AppError from "../../utils/error/app-error";
import { BlogModel } from "../../models/blog.model";
import CommentModel from "../../models/comment.model";

// export const softDeleteCmt = catchAsync(async (req, res) => {
//   // get cmt
//   const cmt = req.cmt;
//   if (!cmt) throw new AppError("Comment not found", 404);

//   // delete cmt (soft delete)
//   cmt.isDeleted = true;
//   await cmt.save();

//   // update cmt't parent replyCount
//   if (cmt.parentId !== null) {
//     await CommentModel.findByIdAndUpdate(cmt.parentId, {
//       $inc: { replyCount: -1 },
//     });
//   }
//   // update blog's totalParentCmts
//   else
//     await BlogModel.findByIdAndUpdate(cmt.blogId, {
//       $inc: { totalParentCmts: -1 },
//     });

//   // update blog's totalCmts
//   await BlogModel.findByIdAndUpdate(cmt.blogId, {
//     $inc: { totalCmts: -1 },
//   });

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

export const softDeleteCmt = catchAsync(async (req, res) => {
  const cmt = req.cmt; // Lean object from middleware
  if (!cmt) throw new AppError("Comment not found", 404);

  const writeOps: Promise<any>[] = [];

  //  Queue the atomic comment state update
  writeOps.push(
    CommentModel.findByIdAndUpdate(cmt._id, { $set: { isDeleted: true } }),
  );

  //  Consolidate data counters and run them concurrently
  if (cmt.parentId !== null) {
    // If it's a sub-reply: Decrement parent replyCount
    writeOps.push(
      CommentModel.findByIdAndUpdate(cmt.parentId, {
        $inc: { replyCount: -1 },
      }),
    );
    // Decrement overall blog comment tracker
    writeOps.push(
      BlogModel.findByIdAndUpdate(cmt.blogId, { $inc: { totalCmts: -1 } }),
    );
  } else {
    // If it's a top-level parent comment: Update BOTH blog metrics inside ONE call
    writeOps.push(
      BlogModel.findByIdAndUpdate(cmt.blogId, {
        $inc: { totalParentCmts: -1, totalCmts: -1 }, // Combined into a single database instruction object
      }),
    );
  }

  // Fire all mutation instructions simultaneously over the open network connection pool
  await Promise.all(writeOps);

  // Return standard 204 No Content response
  res.status(204).json({
    status: "success",
    data: null,
  });
});
