/** @format */

import mongoose, { Schema, Types, model } from "mongoose";
import { BlogDocument } from "../types/blog.type";
import { IBlogContent } from "../validation/blog.validation";
import { generateUniqueSlug } from "../utils/helpers/generate-unique-slug";
import CommentModel from "./comment.model";

const contentBlockSchema = new Schema<IBlogContent>(
  {
    type: {
      type: String,
      enum: [
        "paragraph",
        "title",
        "section",
        "quote",
        "highlight",
        "meta",
        "image",
      ],
      default: "paragraph",
      required: true,
    },
    text: {
      type: String,
      required: function (this: any) {
        // Text is only required when the block type is not an image
        return this.type !== "image";
      },
      validate: {
        validator: function (this: any, v: string) {
          // If type is image, text must not be present
          if (this.type === "image") return !v;
          return true;
        },
        message: "Text is not allowed in image blocks",
      },
    },
    img: {
      type: String,
      required: function (this: any) {
        // Image is required when the block type is 'image'
        return this.type === "image";
      },
      validate: {
        validator: function (this: any, v: string) {
          // If it's not an image block, img must not be present
          if (this.type !== "image") return !v;

          if (!v) return false;
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "Image must be a valid URL and only allowed in image blocks",
      },
    },
    note: {
      type: String,
      validate: {
        validator: function (this: any, v: string) {
          if (!v) return true;
          // Note is only permitted for image blocks
          return this.type === "image";
        },
        message: "Note is only allowed for image blocks",
      },
    },
  },
  { _id: false }, // no _id for subdocuments
);

const BlogSchema = new Schema<BlogDocument>(
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
      unique: true,
    },
    authors: {
      type: [String],
      default: [],
      // index: true,
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
    thumbnail: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true; // optional
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "Thumbnail must be a valid URL",
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
    totalCmts: {
      type: Number,
      default: 0,
    },
    totalParentCmts: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  },
);

BlogSchema.index({ title: "text" }); // text index for searching in title
BlogSchema.index({ categories: 1 });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ createdAt: 1 });
BlogSchema.index({ updatedAt: 1 });

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

// delete cmt after delete blog
BlogSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    const blogId = doc._id;

    // IMPORTANT: Do not use await here => push to wait queue => free main thread
    CommentModel.deleteMany({ blogId: blogId })
      .then((result) => {
        console.log(`${result.deletedCount} comments deleted in background`);
      })
      .catch((err) => {
        console.error("Error occur when deleting comment in background", err);
      });
  }
});

export const BlogModel = model<BlogDocument>("Blog", BlogSchema);
