/** @format */

import { BlogList } from "./types/blog-list.type";
import { Comment } from "./types/comment.type";
import { UserDocument } from "./types/user.type";
import { HydratedDocument, Types } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>;

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      accessToken?: String;
      cmt?: CommentDocument;
      blogList?: HydratedDocument<BlogList>;
      _commentFilter?: {
        parentId?: Types.ObjectId | null;
        userId?: Types.ObjectId;
        blogId?: Types.ObjectId;
        isDeleted?: boolean;
      };
      _extraMetadata?: {
        totalCmts: number;
        totalParentCmts: number;
        nextPage?: number | undefined;
      };
    }
  }
}

export {};
