/** @format */

import { Types } from "mongoose";

export interface ExtraMetadata {
  totalResult?: number;
  totalParentCmts?: number;
  nextPage?: number | null;
}

export interface BuildUserCmtPipelineProps {
  userObjectId: Types.ObjectId;
  skip: number;
  limit: number;
}

export const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  top: { upVotes: -1 },
};

export const DEFAULT_SORT = "top";
export const DEFAULT_COMMENT_LIMIT = 20;

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
