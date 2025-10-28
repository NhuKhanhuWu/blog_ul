/** @format */

import { Schema, model, Document } from "mongoose";

export interface BlogDocument extends Document {
  url: string;
  title: string;
  authors: string[];
  categories: string[];
  pub_date: Date;
  content: {
    text: string;
  }[];
}

const BlogSchema = new Schema<BlogDocument>(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    authors: {
      type: [String],
      default: [],
      index: true, // for filtering
    },
    categories: {
      type: [String],
      default: [],
      index: true, // for filtering
    },
    pub_date: {
      type: Date,
      required: true,
      index: true, // for sorting/filtering by date
    },
    content: [
      {
        text: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

export const BlogModel = model<BlogDocument>("Blog", BlogSchema);
