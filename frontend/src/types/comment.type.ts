/** @format */

import { InfiniteData } from "@tanstack/react-query";

export interface Cmt {
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

export interface GetCmtRes {
  data: Cmt[];
  totalResult: number;
  nextPage: number | undefined;
}

export type CmtCache = InfiniteData<{ data: Cmt[]; nextPage?: number }>;

export interface CreateCmt {
  blogId: string;
  parentId?: string | undefined;
  content: string;
}

export interface GetCmtByBlog {
  blogId: string;
  sort: string;
  page: number;
  limit?: number;
  parentId?: string;
}
