/** @format */

import axiosInstance from "../../utils/axiosInstance";

interface IGetCmtByBlog {
  blogId: string;
  sort: string;
}

export async function getCmtByBlog(blogId: string) {
  const data = await axiosInstance.get(`/blogs/${blogId}/cmt`);

  return data.data;
}
