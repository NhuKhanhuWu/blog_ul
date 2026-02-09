/** @format */

import { Types } from "mongoose";

export interface IToken {
  token: string;
  userId: Types.ObjectId;
  sessionExpiresAt: Date;
  revoked: boolean;
  revokedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}
