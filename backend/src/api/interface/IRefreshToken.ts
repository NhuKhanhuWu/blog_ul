/** @format */

import { Types } from "mongoose";

export interface IRefreshToken {
  token: string;
  userId: Types.ObjectId;
  tokenExpires?: Date | null;
}
