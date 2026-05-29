/** @format */

import { Model, model, Schema, Types } from "mongoose";
import { BlogList } from "../types/blog-list.type";
import AppError from "../utils/error/app-error";

const BlogListSchema = new Schema<BlogList>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Blog's name cannot exceed 100 characters"],
    },

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    blogs: {
      type: [
        {
          type: Types.ObjectId,
          ref: "Blog",
        },
      ],
      validate: {
        validator: function (blogs: Types.ObjectId[]) {
          return blogs.length <= 500;
        },
        message: "A list can contain at most 500 blogs",
      },
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

// check if user try to create >50 list
BlogListSchema.pre("save", async function (next) {
  if (this.isNew) {
    const LIMIT = 50;
    const { userId } = this;
    const model = this.constructor as Model<BlogList>;
    const listCnt = await model.countDocuments({ userId });

    if (listCnt >= LIMIT)
      throw new AppError("You can only have at most 50 list", 403);
  }

  next();
});

export const BlogListModel = model<BlogList>("BlogList", BlogListSchema);
