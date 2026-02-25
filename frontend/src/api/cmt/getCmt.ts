/** @format */

import axiosInstance from "../../utils/axiosInstance";

interface IGetCmtByBlog {
  blogId: string;
  sort: string;
  pageParam: number;
}

export async function getCmtByBlog({ blogId, sort, pageParam }: IGetCmtByBlog) {
  const query = `sort=${sort}&page=${pageParam}`;
  console.log(1);
  const data = await axiosInstance.get(`/blogs/${blogId}/cmt?${query}`);

  return data.data;
}
