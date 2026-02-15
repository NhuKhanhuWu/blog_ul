/** @format */

import { IBlogSimplify } from "../../interface/blog";
import axiosInstance from "../../utils/axiosInstance";

export async function getBlogs(query: string): Promise<IBlogSimplify[]> {
  const data = await axiosInstance.get(`/blogs?${query}`);

  return data.data.data;
}
