/** @format */

import {
  Cmt,
  CreateCmt,
  EditCmt,
  GetCmtByBlog,
  GetCmtRes,
} from "../types/comment.type";
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
  replyToId = undefined,
  content,
}: CreateCmt): Promise<Cmt> {
  const res = await axiosInstance.post(`/blogs/${blogId}/cmt`, {
    replyToId,
    content,
  });

  return res.data.data;
}

export async function editCmt({ cmtId, content }: EditCmt): Promise<Cmt> {
  const res = await axiosInstance.patch(`/cmt/${cmtId}`, {
    content: content,
  });

  return res.data;
}

export async function deleteCmt(cmtId: string): Promise<void> {
  await axiosInstance.delete(`/cmt/${cmtId}`);
}
