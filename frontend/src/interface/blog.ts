/** @format */

export interface IBlogSimplify {
  _id: string;
  title: string;
  slug: string;
  upVotes?: number;
  pub_date: string;
  authors: string[];
  img?: string;
  preview: {
    text: string;
  };
}

export interface IBlogCard {
  blog: IBlogSimplify;
}
