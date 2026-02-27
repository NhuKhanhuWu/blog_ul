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
  isDeleted: boolean;
  createdAt: Date;
}

export interface IGetCmtRes {
  data: ICmt[];
  totalResult: number;
  nextPage: number | undefined;
}
