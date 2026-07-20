/** @format */

export interface IVoteResponse {
  action: "create" | "delete" | "update";
  voteType: 0 | 1 | -1;
  upVotes: number;
  downVotes: number;
}

export interface IToggleVote {
  targetId: string;
  voteType: -1 | 1;
  targetType: "comment" | "blog";
}

export type MyBlogVote = {
  voteType: 1 | -1;
  _id: string;
  title: string;
  slug: string;
  createdAt: Date;
};

export type MyCommentVote = {
  commentId: string;
  commentContent: string;
} & MyBlogVote;

export interface GetMyBlogVotesResponse {
  data: MyBlogVote[];
  totalResult: number;
  nextPage: number | undefined;
}

export type GroupedVotes = Record<string, MyBlogVote[] | MyCommentVote[]>;
// export type GroupedCommentVotes = Record<string, MyCommentVote[]>;
