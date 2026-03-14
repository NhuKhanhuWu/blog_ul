/** @format */

import { Document, Types } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  blogCount?: number; // optional (dùng để cache số blog)
}

export interface ICategoryDocument extends ICategory, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
