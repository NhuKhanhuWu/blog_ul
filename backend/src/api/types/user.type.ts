/** @format */
// The shape required when creating a new user
import { Document, Types } from "mongoose";

export interface UserInput {
  name: string;
  email: string;
  password: string; // required when creating
  role?: "user" | "admin" | "moderator"; // optional, defaults to "user"
  avatar?: string;
}

export interface ReqUser {
  _id: Types.ObjectId;
  id: string;
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  slug: string;
  email: string;
  password?: string | undefined; // select: false makes it optional
  passwordConfirm?: string | undefined; // deleted after creation => optional
  role: "user" | "admin" | "moderator";
  avatar?: string | undefined;
  passwordChangedAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
  tokenVersion: number; // for refresh token invalidation

  // methobs
  checkPassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}
