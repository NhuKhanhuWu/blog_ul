/** @format */

export interface IBlogSimplify {
  _id: string;
  title: string;
  slug: string;
  voteScore?: number;
  pub_date: Date;
  authors: string[];
}

export interface IBlogCard {
  blog: IBlogSimplify;
}
