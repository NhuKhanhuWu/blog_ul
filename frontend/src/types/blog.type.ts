/** @format */

import { ReactNode } from "react";
import { ICategory } from "./category.type";

export interface BlogSimplify {
  _id: string;
  title: string;
  slug: string;
  upVotes?: number;
  pub_date: Date;
  authors: string[];
  userId: string;
  thumbnail?: string;
  preview: {
    text: string;
  };
}

export interface BlogCardProps {
  blog: BlogSimplify;
  popItems?: ReactNode;
}

export type ContentBlock =
  | {
      type: "paragraph" | "title" | "section" | "quote" | "highlight" | "meta";
      text: string;
      img?: undefined;
      note?: undefined;
    }
  | {
      type: "image";
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

  userId: {
    name: string;
    avatar: string;
    slug: string;
  };

  categories: ICategory[];

  pub_date?: string;

  content: ContentBlock[];

  images: string[]; // max 5 (validated at schema level)

  upVotes: number;
  downVotes: number;

  voteType: number;

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
  totalResult: number;
  nextPage: number | undefined;
}

export interface GetBlogs {
  query: string;
  pageParam: number;
}
