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
  _id: Types.ObjectId;
}
export interface IUpdateVoteScore {
  targetType: "blog" | "comment";
  targetId: string;
  voteType: 1 | -1;
  action: "create" | "delete" | "update";
}
