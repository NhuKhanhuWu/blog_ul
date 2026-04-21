/** @format */

import { Cmt, CreateCmt, GetCmtByBlog, GetCmtRes } from "../types/comment.type";
import axiosInstance from "../utils/axios-instance";

export async function getCmtByBlog({
  blogId,
  sort,
  page,
  limit = 20,
  parentId = "",
}: GetCmtByBlog): Promise<GetCmtRes> {
  const query = `sort=${sort}&page=${page}&parentId=${parentId}&limit=${limit}`;
  const data = await axiosInstance.get(`/blogs/${blogId}/cmt?${query}`);

  return data.data;
}

export async function createCmt({
  blogId,
  parentId = undefined,
  content,
}: CreateCmt): Promise<Cmt> {
  const res = await axiosInstance.post(`/blogs/${blogId}/cmt`, {
    parentId,
    content,
  });

  return res.data.data;
}
