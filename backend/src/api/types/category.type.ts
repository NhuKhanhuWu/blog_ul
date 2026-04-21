/** @format */

import { Document, Types } from "mongoose";

export interface Category {
  name: string;
  slug: string;
  blogCount?: number; // optional (dùng để cache số blog)
}

export interface CategoryDocument extends Category, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
