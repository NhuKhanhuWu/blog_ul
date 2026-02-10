/** @format */

import { Types } from "mongoose";

export interface IComment {
  _id?: Types.ObjectId;

  userId: Types.ObjectId;
  blogId: Types.ObjectId;

  parentId?: Types.ObjectId | null;

  content: string;

  voteScore: number;
  upVotes: number;
  downVotes: number;

  replyCount: number;

  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
