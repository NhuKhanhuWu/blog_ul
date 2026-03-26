/** @format */

import { ICreateCmtRes } from "../../interface/cmtTypes";
import axiosInstance from "../../utils/axiosInstance";

interface ICreateCmt {
  blogId: string;
  parentId?: string | null;
  content: string;
}

export async function createCmt({
  blogId,
  parentId = null,
  content,
}: ICreateCmt): Promise<ICreateCmtRes> {
  const res = await axiosInstance.post(`/blogs/${blogId}/cmt`, {
    parentId,
    content,
  });

  return res.data;
}
