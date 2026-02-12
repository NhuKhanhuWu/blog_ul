/** @format */

import { Types } from "mongoose";
import { IBlogContent } from "../utils/schema/blogSchema";

export interface IBlogInput {
  userId: Types.ObjectId;
  title: string;
  content: IBlogContent;
  authors: string[];
  categories: Types.ObjectId[];
}

// export interface IBlogDocument extends IBlogInput {}
export interface IBlogDocument extends IBlogInput {
  url?: string;
  slug: string;
  pub_date: Date;
  isPrivate: boolean;
  images: [String];
  voteScore: Number;
}
