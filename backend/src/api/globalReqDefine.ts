/** @format */

import { IComment } from "./interface/IComment";
import { IUserDocument } from "./interface/IUser";
import { HydratedDocument } from "mongoose";

export type CommentDocument = HydratedDocument<IComment>;

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      accessToken?: String;
      cmt?: CommentDocument;
    }
  }
}

export {};
