/** @format */

import mongoose, { Schema, Types, model } from "mongoose";
import { BlogDocument } from "../types/blog.type";
import {
  IBlogContent,
  MAX_CATEGORIES,
  MAX_EMBED_IMAGES,
  MAX_UPLOAD_IMAGES,
} from "../validation/blog.validation";
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
        return this.type !== "image";
      },
      validate: {
        validator: function (this: any, v: string) {
          if (this.type === "image") return !v;
          return true;
        },
        message: "Text is not allowed in image blocks",
      },
    },
    img: {
      type: String,
      required: function (this: any) {
        return this.type === "image";
      },
      validate: {
        validator: function (this: any, v: string) {
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
          return this.type === "image";
        },
        message: "Note is only allowed for image blocks",
      },
    },
    isEmbed: {
      type: Boolean,
      default: true,
      validate: {
        validator: function (this: any, v: boolean) {
          if (this.type !== "image") return v === undefined || v === false;
          return true;
        },
        message: "isEmbed is only allowed for image blocks",
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
      trim: true,
      required: function (this: BlogDocument) {
        return !this.isDraft;
      },
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
          return value.length <= MAX_CATEGORIES;
        },
        message: "A blog can have at most 50 categories",
      },
    },
    pub_date: {
      type: Date,
      default: null,
    },
    content: {
      type: [contentBlockSchema],
      default: [],
      validate: {
        validator: function (blocks: any[]) {
          if (!blocks || blocks.length === 0) return true;

          let embedCount = 0;
          let uploadCount = 0;

          for (const block of blocks) {
            if (block.type === "image") {
              if (block.isEmbed) {
                embedCount++;
              } else {
                uploadCount++;
              }
            }
          }

          return (
            embedCount <= MAX_EMBED_IMAGES && uploadCount <= MAX_UPLOAD_IMAGES
          );
        },
        message: function (props: any) {
          const blocks = props.value || [];

          const embedCount = blocks.filter(
            (b: any) => b.type === "image" && b.isEmbed,
          ).length;

          const uploadCount = blocks.filter(
            (b: any) => b.type === "image" && !b.isEmbed,
          ).length;

          if (embedCount > MAX_EMBED_IMAGES) {
            return `Too many embedded images: max ${MAX_EMBED_IMAGES}, got ${embedCount}.`;
          }

          if (uploadCount > MAX_UPLOAD_IMAGES) {
            return `Too many uploaded images: max ${MAX_UPLOAD_IMAGES}, got ${uploadCount}.`;
          }

          return "Invalid image count in content.";
        },
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
    isDraft: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  },
);

BlogSchema.index({ title: "text" }); // text index for searching in title
BlogSchema.index({ categories: 1 });
BlogSchema.index({ createdAt: 1 });
BlogSchema.index({ updatedAt: 1 });
BlogSchema.index({ isDraft: 1 });

// add & pub_date slug before saving
BlogSchema.pre("save", async function (next) {
  // Generate slug only when title exists and is modified
  if (this.title && this.isModified("title")) {
    const BlogModel = this.constructor as mongoose.Model<any>;

    const slug = await generateUniqueSlug(
      BlogModel,
      this.title,
      this._id.toString(),
    );

    this.slug = slug;
  }

  // Set publication date only on first publish
  if (!this.isDraft && !this.pub_date) {
    this.pub_date = new Date();
  }

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
