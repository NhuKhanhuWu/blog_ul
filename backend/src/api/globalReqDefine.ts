/** @format */

import { IToken } from "./interface/IToken";
import { IUserDocument } from "./interface/IUser";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      accessToken?: String;
    }
  }
}

export {};
