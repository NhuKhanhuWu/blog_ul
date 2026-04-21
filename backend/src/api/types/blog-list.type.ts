/** @format */

import { Types, Document } from "mongoose";

export interface BlogList extends Document {
  name: string;
  userId: Types.ObjectId;
  description?: string;
  blogs: Types.ObjectId[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
}
