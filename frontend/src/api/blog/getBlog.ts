/** @format */

import { IBlogDetail, IBlogSimplify } from "../../interface/blog";
import axiosInstance from "../../utils/axiosInstance";

interface IGetBlogs {
  query: string;
  pageParam: number;
}

interface IGetBlogsRes {
  data: IBlogSimplify[];
  nextPage: number | undefined;
}

export async function getBlogs({
  query,
  pageParam,
}: IGetBlogs): Promise<IGetBlogsRes> {
  const data = await axiosInstance.get(`/blogs?${query}&page=${pageParam}`);

  return data.data;
}

export async function getBLog(slug: string): Promise<IBlogDetail> {
  const data = await axiosInstance.get(`/blogs/slug/${slug}`);

  return data.data.data;
}
