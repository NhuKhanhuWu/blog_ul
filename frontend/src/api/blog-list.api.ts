/** @format */

import { BlogListData, BlogListSimplify } from "../types/blog-list.type";
import axiosInstance from "../utils/axios-instance";

export async function getMultBlogList(
  userId?: string,
  blogId?: string,
): Promise<BlogListSimplify[]> {
  let query = "";
  if (userId) query += `userId=${userId}`;
  if (blogId) query += `${query ? "&" : ""}currentBlogId=${blogId}`;

  const res = await axiosInstance.get(`/blog-list?${query}`);

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
