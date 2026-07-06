/** @format */

import { Types, Document } from "mongoose";

export interface BlogList extends Document {
  name: string;
  userId: Types.ObjectId;
  description?: string;
  blogs: Types.Array<Types.ObjectId>;
  isPrivate: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
}

export interface UpdateBlogListPayload {
  title?: string;
  description?: string;
  isPublic?: boolean;
}
