/** @format */

import { IUserDocument } from "./interface/IUser";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export {};
