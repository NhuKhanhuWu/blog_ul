/** @format */

import { FlattenMaps, Types } from "mongoose";
import { IBlogContent } from "../validation/blog.validation";

export interface BlogInput {
  userId: Types.ObjectId;
  title: string;
  content: IBlogContent[];
  authors: string[];
  categories: Types.Array<Types.ObjectId>;
}

export interface BlogDocument extends BlogInput {
  url?: string;
  slug: string;
  pub_date: Date;
  isPrivate: boolean;
  upVotes: number;
  downVotes: number;
  totalCmts: number;
  totalParentCmts: number;
  isDraft: boolean;
}

export interface BlogWithVote extends FlattenMaps<BlogDocument> {
  _id: Types.ObjectId;
  voteType: number;
}
