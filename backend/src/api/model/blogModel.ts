/** @format */

import { Schema, model } from "mongoose";
import { IBlogDocument } from "../interface/IBlog";
import { IBlogContent } from "../utils/schema/blogSchema";
import slugify from "slugify";

const contentBlockSchema = new Schema<IBlogContent>(
  {
    // For text blocks
    text: {
      type: String,
      required: function (this: any) {
        return !this.img; // required if no image
      },
    },
    heading: {
      type: Number,
      min: 1,
      max: 6,
    },

    // For image blocks
    img: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true; // optional
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "Image must be a valid URL",
      },
    },
    note: {
      type: String,
    },
  },
  { _id: false }, // no _id for subdocuments
);

const BlogSchema = new Schema<IBlogDocument>(
  {
    url: {
      type: String,
      // unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    slug: {
      type: String,
      // index: true,
      unique: true,
    },
    authors: {
      type: [String],
      default: [],
      index: true, // for filtering
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categories: {
      type: [String],
      default: [],
      index: true, // for filtering
    },
    pub_date: {
      type: Date,
      index: true, // for sorting/filtering by date
    },
    content: [contentBlockSchema],
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (value: string[]) {
          return value.length <= 5;
        },
        message: "A blog can have at most 5 images",
      },
    },
    upVotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  },
);

BlogSchema.index({ slug: "text" }); // text index for searching in slug

BlogSchema.index({ title: "text" }); // text index for searching in title

// add slug before saving
BlogSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

// add pub_date before saving
BlogSchema.pre("save", function (next) {
  this.pub_date = new Date();
  next();
});

export const BlogModel = model<IBlogDocument>("Blog", BlogSchema);
