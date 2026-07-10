/** @format */

import CommentModel from "../../models/comment.model";
import catchAsync from "../../utils/error/catch-async";
import { BlogModel } from "../../models/blog.model";
import { Types } from "mongoose";
import UserModel from "../../models/user.model";
import { CommentMention } from "../../types/comment.type";

const MAX_DEPTH = 3; // level 0,1,2 normal nested; flatten cmt from 3

export const createCmt = catchAsync(async (req, res) => {
  const blogId = req.params.id;
  const { content } = req.body;
  const replyToCmt = req.cmt;
  const userId = req.user?._id;

  let depth = 0;
  let parentId: Types.ObjectId | null = null;
  let replyToId: Types.ObjectId | null = null;
  let finalContent = content;
  let mentions: CommentMention[] = [];

  if (replyToCmt) {
    depth = replyToCmt.depth + 1;
    replyToId = replyToCmt._id || null; // always keep real parent

    if (depth < MAX_DEPTH) {
      // if depth still in limit -> parentID (for UI) = real parent
      parentId = replyToCmt._id || null;
    } else {
      // exceed limit -> flat out cmt -> parentId = replyToCmt.parentId
      parentId = replyToCmt.parentId || null;

      // automatically add mention
      const repliedUser = await UserModel.findById(replyToCmt.userId).select(
        "slug",
      );
      if (repliedUser) {
        const mentionText = `@${repliedUser.slug}`;
        finalContent = `${mentionText} ${content}`;

        mentions = [
          {
            slug: repliedUser.slug,
            offset: 0,
            length: mentionText.length,
          },
        ];
      }
    }
  }

  const comment = await CommentModel.create({
    userId,
    blogId,
    parentId,
    replyToId,
    depth,
    content: finalContent,
    mentions,
  });

  const writeOps: Promise<any>[] = [];

  // child cmt
  if (parentId) {
    // increase parent's replies count
    writeOps.push(
      CommentModel.findByIdAndUpdate(parentId, { $inc: { replyCount: 1 } }),
    );

    // increase blog's cmt count
    writeOps.push(
      BlogModel.findByIdAndUpdate(blogId, { $inc: { totalCmts: 1 } }),
    );
  }

  // root cmt
  else {
    // increase blog's total and root cmt count
    writeOps.push(
      BlogModel.findByIdAndUpdate(blogId, {
        $inc: { totalParentCmts: 1, totalCmts: 1 },
      }),
    );
  }

  writeOps.push(comment.populate({ path: "userId", select: "name slug" }));

  await Promise.all(writeOps);

  res.status(201).json({
    status: "success",
    data: comment,
  });
});
