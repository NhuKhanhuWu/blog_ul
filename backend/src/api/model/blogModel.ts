/** @format */

import mongoose, { Schema, Types, model } from "mongoose";
import { IBlogDocument } from "../interface/IBlog";
import { IBlogContent } from "../utils/schema/blogSchema";
import slugify from "slugify";
import { generateUniqueSlug } from "../utils/schema/generateUniqueSlug";

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
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      validate: {
        validator: function (value: Types.ObjectId[]) {
          return value.length <= 50;
        },
        message: "A blog can have at most 50 categories",
      },
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

// add & pub_date slug before saving
BlogSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  // Use this.constructor to access the Model from the Document
  const BlogModel = this.constructor as mongoose.Model<any>;
  const slug = await generateUniqueSlug(
    BlogModel,
    this.title,
    this._id.toString(),
  );

  this.slug = slug;
  this.pub_date = new Date();

  next();
});

BlogSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;

  const title = update?.title ?? update?.$set?.title;
  if (!title) return next();

  const blog = await this.model.findOne(this.getQuery());
  if (!blog) return next();

  const newSlug = await generateUniqueSlug(
    this.model,
    title,
    blog._id.toString(),
  );

  if (update.$set) {
    update.$set.slug = newSlug;
  } else {
    update.slug = newSlug;
  }
});

export const BlogModel = model<IBlogDocument>("Blog", BlogSchema);
