/** @format */

import { Comment } from "./types/comment.type";
import { UserDocument } from "./types/user.type";
import { HydratedDocument } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>;

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      accessToken?: String;
      cmt?: CommentDocument;
    }
  }
}

export {};
