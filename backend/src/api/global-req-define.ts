/** @format */

import { BlogList } from "./types/blog-list.type";
import { Comment } from "./types/comment.type";
import { ReqUser } from "./types/user.type";
import { HydratedDocument, Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: ReqUser;
      accessToken?: String;
      cmt?: Comment;
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
