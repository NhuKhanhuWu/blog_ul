/** @format */

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
  voteType: 0 | 1 | -1; // user vote type for this cmt (0: not vote; 1:upVote; -1:downVote)
  isDeleted: boolean;
  createdAt: Date;
}

export interface IGetCmtRes {
  data: ICmt[];
  totalResult: number;
  nextPage: number | undefined;
}
