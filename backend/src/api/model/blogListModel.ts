/** @format */

import { model, Schema, Types } from "mongoose";
import { IBlogList } from "../interface/IBlogList";
import AppError from "../utils/AppError";

const blogListSchema = new Schema<IBlogList>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    description: {
      type: String,
      default: "",
    },

    blogs: [
      {
        type: Types.ObjectId,
        ref: "Blog",
      },
    ],

    isPrivate: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

// send unique error for duplicate blog list name per user
blogListSchema.post(
  ["save", "findOneAndUpdate"],
  function (error: any, doc: any, next: any) {
    if (error.code === 11000) {
      return next(new AppError("Blog list name must be unique per user.", 400));
    }

    next(error);
  }
);

blogListSchema.index({ userId: 1, name: 1 }, { unique: true });

export const BlogListModel = model<IBlogList>("BlogList", blogListSchema);
