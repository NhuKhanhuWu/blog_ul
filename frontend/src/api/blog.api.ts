/** @format */

import {
  GetBlogs,
  GetBlogsResponse,
  BlogDetailProps,
} from "../types/blog.type";
import axiosInstance from "../utils/axios-instance";

export async function getBlogs({
  query,
  pageParam,
}: GetBlogs): Promise<GetBlogsResponse> {
  const data = await axiosInstance.get(`/blogs?${query}&page=${pageParam}`);

  return data.data;
}

export async function getBLog(slug: string): Promise<BlogDetailProps> {
  const data = await axiosInstance.get(`/blogs/slug/${slug}`);

  return data.data.data;
}
