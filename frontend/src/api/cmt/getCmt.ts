/** @format */

import { IGetCmtRes } from "../../interface/cmtTypes";
import axiosInstance from "../../utils/axiosInstance";

interface IGetCmtByBlog {
  blogId: string;
  sort: string;
  page: number;
  limit?: number;
  parentId?: string | null;
}

export async function getCmtByBlog({
  blogId,
  sort,
  page,
  limit = 20,
  parentId = null,
}: IGetCmtByBlog): Promise<IGetCmtRes> {
  const query = `sort=${sort}&page=${page}&parentId=${parentId}&limit=${limit}`;
  const data = await axiosInstance.get(`/blogs/${blogId}/cmt?${query}`);

  return data.data;
}
