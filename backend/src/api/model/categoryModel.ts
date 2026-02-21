/** @format */

import { model, Schema } from "mongoose";
import { ICategoryDocument } from "../interface/ICategory";

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    blogCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

CategorySchema.index({ name: 1 });
CategorySchema.index({ slug: 1 });
CategorySchema.index({ name: "text" });

// auto create slug
CategorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
  next();
});

export const CategoryModel = model<ICategoryDocument>(
  "Category",
  CategorySchema,
);
