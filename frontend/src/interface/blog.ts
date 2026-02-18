/** @format */

export interface IBlogSimplify {
  _id: string;
  title: string;
  slug: string;
  voteScore?: number;
  pub_date: string;
  authors: string[];
  preview: {
    text: string;
  };
}

export interface IBlogCard {
  blog: IBlogSimplify;
}
