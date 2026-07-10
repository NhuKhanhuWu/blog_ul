/** @format */

import { Types } from "mongoose";

export interface CommentMention {
  slug: string; // slug, use to build link /profile/:slug
  offset: number; // start position in cmt
  length: number; // length (including @)
}

export interface Comment {
  _id?: Types.ObjectId;

  userId: Types.ObjectId;
  blogId: Types.ObjectId;

  parentId?: Types.ObjectId | null; // cmt use for display, avoid nested cmt
  replyToId?: Types.ObjectId | null; // cmt that user reply to, for notification

  depth: number;

  content: string;
  mentions: CommentMention[];

  upVotes: number;
  downVotes: number;

  replyCount: number;

  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
