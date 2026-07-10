/** @format */

import { Types } from "mongoose";

export interface CommentReply {
  _id: Types.ObjectId;
  slug: string;
}

export interface Comment {
  _id?: Types.ObjectId;

  userId: Types.ObjectId;
  blogId: Types.ObjectId;

  parentId?: Types.ObjectId | null; // cmt use for display, avoid nested cmt
  replyTo?: {
    _id: Types.ObjectId | null;
    slug: string;
  }; // cmt that user reply to, for notification

  depth: number;

  content: string;

  upVotes: number;
  downVotes: number;

  replyCount: number;

  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
