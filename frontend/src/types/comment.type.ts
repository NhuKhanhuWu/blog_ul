/** @format */

import { InfiniteData } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

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
  mentions: { slug: string; offset: number; length: number }[];
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
  replyToId?: string | undefined;
  content: string;
}

export interface GetCmtByBlog {
  blogId: string;
  sort: string;
  page: number;
  limit?: number;
  parentId?: string;
}

export interface EditCmt {
  cmtId: string;
  content: string;
}

// export interface CmtFormProps {
//   isUsing: boolean;
//   setIsUsing: Dispatch<SetStateAction<boolean>>;
//   blogId: string;
//   replyToId?: string;
// }

interface BaseCmtFormProps {
  isUsing: boolean;
  setIsUsing: Dispatch<SetStateAction<boolean>>;
  blogId: string;
}

export type CmtFormProps = BaseCmtFormProps &
  (
    | {
        replyToId: string;
        mentions: CmtMentionProps[]; // require mentions when pass replyToId
      }
    | {
        // avoid pass replyToId / mentions ablone
        replyToId?: never;
        mentions?: never;
      }
  );

export interface CmtMentionProps {
  slug: string;
  offset: number;
  length: number;
}
