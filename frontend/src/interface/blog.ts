/** @format */

import { ICategory } from "./category";

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

export type IContentBlock =
  | {
      text: string;
      heading?: 1 | 2 | 3 | 4 | 5 | 6;
      img?: undefined;
      note?: undefined;
    }
  | {
      img: string;
      note?: string;
      text?: undefined;
      heading?: undefined;
    };

export interface IBlogDetail {
  url?: string;
  title: string;
  slug: string;
  authors: string[];

  userId: string;

  categories: ICategory[];

  pub_date?: string;

  content: IContentBlock[];

  images: string[]; // max 5 (validated at schema level)

  upVotes: number;
  downVotes: number;

  createdAt: Date;
  updatedAt: Date;
}

export type NormalizedContent =
  | { type: "title"; text: string }
  | { type: "section"; text: string }
  | { type: "quote"; text: string }
  | { type: "highlight"; text: string }
  | { type: "meta"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; img: string; note?: string };

export type INormalizedBlog = Omit<IBlogDetail, "content"> & {
  content: NormalizedContent[];
};
