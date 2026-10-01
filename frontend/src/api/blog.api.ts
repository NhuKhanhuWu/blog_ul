/** @format */

import {
  GetBlogs,
  GetBlogsResponse,
  GetMyBlogs,
  BlogDetailProps,
  ContentBlock,
} from "../types/blog.type";
import axios from "axios";
import axiosInstance from "../utils/core/axios-instance";
import { ICategories } from "../types/category.type";

interface SaveDraftProps {
  id: string;
  title?: string;
  categories?: ICategories;
  blogContent?: ContentBlock[];
  isPrivate?: boolean;
}

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

export async function getOneBLogBySlug(slug: string): Promise<BlogDetailProps> {
  const data = await axiosInstance.get(`/blog/slug/${slug}`);

  return data.data.data;
}

export async function createBlog(): Promise<BlogDetailProps> {
  const data = await axiosInstance.post("/blog");

  return data.data;
}

export async function uploadBlogImage(
  blogId: string,
  file: File,
): Promise<string> {
  const response = await axiosInstance.post(
    `/blog/${blogId}/image-upload-url`,
    { fileName: file.name },
  );
  const { signedUrl, publicUrl } = response.data.data;

  await axios.put(signedUrl, file, {
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });

  return publicUrl;
}

export async function getMyBlogById(id: string) {
  const data = await axiosInstance.get(`/blog/${id}`);

  return data.data;
}

export async function saveDraft({
  id,
  title,
  categories,
  blogContent,
  isPrivate,
}: SaveDraftProps): Promise<BlogDetailProps> {
  const data = await axiosInstance.patch(`/blog/${id}`, {
    title,
    categories,
    content: blogContent,
    isPrivate,
  });

  return data.data;
}
