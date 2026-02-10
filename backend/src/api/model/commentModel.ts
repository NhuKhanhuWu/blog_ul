/** @format */

import mongoose, { Schema } from "mongoose";
import { IComment } from "../interface/IComment";

const commentSchema = new Schema<IComment>(
  {
    // tác giả comment
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // comment thuộc post nào
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    // reply cho comment nào (null = comment gốc)
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },

    // nội dung comment
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    // vote
    voteScore: {
      type: Number,
      default: 0,
    },

    upVotes: {
      type: Number,
      default: 0,
    },

    downVotes: {
      type: Number,
      default: 0,
    },

    // số lượng reply trực tiếp
    replyCount: {
      type: Number,
      default: 0,
    },

    // soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/* ================= INDEX ================= */

// load comment theo post
commentSchema.index({ postId: 1, createdAt: -1 });

// load reply
commentSchema.index({ parentId: 1, createdAt: 1 });

// load comment của user
commentSchema.index({ authorId: 1 });

// lọc comment chưa bị xoá
commentSchema.index({ isDeleted: 1 });

const CommentModel = mongoose.model<IComment>("Comment", commentSchema);

export default CommentModel;
