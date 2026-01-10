/** @format */

import { Types } from "mongoose";

export enum VoteType {
  UP = 1,
  DOWN = -1,
}

export enum VoteTargetType {
  POST = "post",
  COMMENT = "comment",
}

export interface IVote {
  userId: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: VoteTargetType;
  voteType: VoteType;
  createdAt?: Date;
  updatedAt?: Date;
}
