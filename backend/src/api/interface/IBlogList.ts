/** @format */

import { Types, Document } from "mongoose";

export interface IBlogList extends Document {
  name: string;
  userId: Types.ObjectId;
  description?: string;
  blogs: Types.ObjectId[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
}
