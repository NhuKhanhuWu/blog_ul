/** @format */

import { Types } from "mongoose";
import { IBlogContent } from "../utils/schema/blogSchema";

export interface IBlogInput {
  userId: Types.ObjectId;
  title: string;
  content: IBlogContent;
  authors: string[];
  categories: string[];
}

// export interface IBlogDocument extends IBlogInput {}
export interface IBlogDocument extends IBlogInput {
  url?: string;
  pub_date: Date;
}
