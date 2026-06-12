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
