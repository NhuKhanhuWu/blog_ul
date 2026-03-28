/** @format */

import { ICmt } from "../../interface/cmtTypes";
import axiosInstance from "../../utils/axiosInstance";

interface ICreateCmt {
  blogId: string;
  parentId?: string | undefined;
  content: string;
}

export async function createCmt({
  blogId,
  parentId = undefined,
  content,
}: ICreateCmt): Promise<ICmt> {
  const res = await axiosInstance.post(`/blogs/${blogId}/cmt`, {
    parentId,
    content,
  });

  return res.data.data;
}
