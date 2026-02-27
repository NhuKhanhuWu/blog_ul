/** @format */

import { IGetCmtRes } from "../../interface/cmt";
import axiosInstance from "../../utils/axiosInstance";

interface IGetCmtByBlog {
  blogId: string;
  sort: string;
  pageParam: number;
  parentId?: string | null;
}

export async function getCmtByBlog({
  blogId,
  sort,
  pageParam,
  parentId = null,
}: IGetCmtByBlog): Promise<IGetCmtRes> {
  const parentParams = parentId ? `parentId=${parentId}` : "";
  const query = `sort=${sort}&page=${pageParam}&${parentParams}`;
  const data = await axiosInstance.get(`/blogs/${blogId}/cmt?${query}`);

  return data.data;
}
