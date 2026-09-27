/** @format */

import {
  GetBlogs,
  GetBlogsResponse,
  GetMyBlogs,
  BlogDetailProps,
} from "../types/blog.type";
import axiosInstance from "../utils/axios-instance";

export async function getBlogs({
  query,
  pageParam,
}: GetBlogs): Promise<GetBlogsResponse> {
  const data = await axiosInstance.get(`/blog?${query}&page=${pageParam}`);

  return data.data;
}

export async function getMyBlogs({
  status,
  sort,
  pageParam,
}: GetMyBlogs): Promise<GetBlogsResponse> {
  const params = new URLSearchParams({
    status,
    sort,
    page: String(pageParam),
  });
  const response = await axiosInstance.get(`/blog/me?${params}`);

  return response.data;
}

export async function getBLog(slug: string): Promise<BlogDetailProps> {
  const data = await axiosInstance.get(`/blog/slug/${slug}`);

  return data.data.data;
}

export async function createBlog(): Promise<BlogDetailProps> {
  const data = await axiosInstance.post("/blog");

  return data.data;
}
