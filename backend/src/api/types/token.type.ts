/** @format */

import { Types } from "mongoose";

export interface Token {
  token: string;
  userId: Types.ObjectId;
  sessionExpiresAt: Date;
  revoked: boolean;
  revokedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}
