/** @format */

import mongoose, { Schema } from "mongoose";
import { Comment } from "../types/comment.type";

const commentSchema = new Schema<Comment>(
  {
    // comment owner
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // comment of which blog
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // for which comment (null = root)
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    replyToId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    mentions: {
      type: [
        {
          slug: { type: String, required: true },
          offset: { type: Number, required: true },
          length: { type: Number, required: true },
        },
      ],
      default: [],
      _id: false,
    },

    // cmt's depth
    depth: {
      type: Number,
    },

    // vote
    upVotes: {
      type: Number,
      default: 0,
    },

    downVotes: {
      type: Number,
      default: 0,
    },

    // direct reply cnt
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

// get cmt
commentSchema.index({ userId: 1 }); // user
commentSchema.index({ blogId: 1 }); //blog

// load comment by post
commentSchema.index({ postId: 1, createdAt: -1 });

// load reply
commentSchema.index({ parentId: 1 });

// filter comment undeleted cmt
commentSchema.index({ isDeleted: 1 });

const CommentModel = mongoose.model<Comment>("Comment", commentSchema);

export default CommentModel;
