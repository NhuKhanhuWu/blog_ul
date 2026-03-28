/** @format */

import { InfiniteData } from "@tanstack/react-query";

export interface ICmt {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar: string;
    slug: string;
  };
  blogId: string;
  parentId: string;
  content: string;
  upVotes: number;
  downVotes: number;
  replyCount: number;
  // user vote type for this cmt (0: not vote; 1:upVote; -1:downVote)
  voteType: 0 | 1 | -1;
  createdAt: Date;
}

export interface IGetCmtRes {
  data: ICmt[];
  totalResult: number;
  nextPage: number | undefined;
}

export type CmtCache = InfiniteData<{ data: ICmt[]; nextPage?: number }>;
