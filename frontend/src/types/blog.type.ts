/** @format */

import { ICategory } from "./category.type";

export interface BlogSimplify {
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

export interface BlogCardProps {
  blog: BlogSimplify;
}

export type ContentBlock =
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

export interface BlogDetailProps {
  _id: string;
  url?: string;
  title: string;
  slug: string;
  authors: string[];

  userId: string;

  categories: ICategory[];

  pub_date?: string;

  content: ContentBlock[];

  images: string[]; // max 5 (validated at schema level)

  upVotes: number;
  downVotes: number;

  totalCmts: number;
  totalParentCmt: number;

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

export type NormalizedBlog = Omit<BlogDetailProps, "content"> & {
  content: NormalizedContent[];
};

export interface GetBlogsResponse {
  data: BlogSimplify[];
  nextPage: number | undefined;
}

export interface GetBlogs {
  query: string;
  pageParam: number;
}
