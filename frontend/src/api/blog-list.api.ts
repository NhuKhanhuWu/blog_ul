/** @format */

import {
  BlogListData,
  BlogListSimplify,
  CreateListProps,
  CreateListRes,
  UpdateBlogListArgs,
} from "../types/blog-list.type";
import axiosInstance from "../utils/core/axios-instance";

export async function getMultList(
  userId?: string,
  blogId?: string,
  publicOnly = false,
): Promise<BlogListSimplify[]> {
  const params = new URLSearchParams();
  if (userId) params.set("userId", userId);
  if (blogId) params.set("currentBlogId", blogId);
  if (publicOnly) params.set("publicOnly", "true");

  const res = await axiosInstance.get(`/blog-list?${params}`);

  return res.data.data;
}

export async function getListMetaData(
  blogListId: string,
): Promise<BlogListData> {
  const res = await axiosInstance.get(`/blog-list/${blogListId}`);

  return res.data.data;
}

export async function getBlogFromList(listId: string) {
  const res = await axiosInstance.get(`/blog-list/${listId}/blogs`);

  return res.data;
}

export async function createList(
  listData: CreateListProps,
): Promise<CreateListRes> {
  const res = await axiosInstance.post("/blog-list", { ...listData });

  return res.data;
}

export async function updateList({
  blogListId,
  data,
}: UpdateBlogListArgs): Promise<BlogListData> {
  const res = await axiosInstance.patch(`/blog-list/${blogListId}`, {
    ...data,
  });

  return res.data.data;
}

export async function addBlogToList(
  listId: string,
  blogId: string,
): Promise<BlogListData> {
  const res = await axiosInstance.patch(`/blog-list/${listId}/blogs`, {
    blogId,
  });

  return res.data.data;
}

export async function removeBlogFromList(
  listId: string,
  blogId: string,
): Promise<void> {
  await axiosInstance.delete(`/blog-list/${listId}/blogs/${blogId}`);
}

export async function deleteBlogList(blogListId: string): Promise<void> {
  await axiosInstance.delete(`/blog-list/${blogListId}`);
}
