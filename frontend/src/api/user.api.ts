/** @format */

import { User, UserPublic } from "../types/auth.type";
import { ChangePasswordArgs, ChangePasswordResponse } from "../types/user.type";
import {
  GetMyBlogVotesResponse,
  GetMyCmtVotesResponse,
} from "../types/vote.type";
import axiosInstance from "../utils/axios-instance";

interface QueryWithPageArgs {
  page: number;
}

export async function getMe(): Promise<User> {
  const res = await axiosInstance.get("/user/me");

  return res.data.user;
}

export async function getUser(slug: string): Promise<UserPublic> {
  const res = await axiosInstance.get(`/user/${slug}`);

  return res.data;
}

export async function changePassword(
  changePassData: ChangePasswordArgs,
): Promise<ChangePasswordResponse> {
  const res = await axiosInstance.patch(`/user/change-password`, {
    ...changePassData,
  });

  return res.data;
}

export async function getMyBlogVotes({
  page,
}: QueryWithPageArgs): Promise<GetMyBlogVotesResponse> {
  const res = await axiosInstance.get(`/user/me/my-blog-vote?page=${page}`);

  return res.data;
}

export async function getMyCmtVotes({
  page,
}: QueryWithPageArgs): Promise<GetMyCmtVotesResponse> {
  const res = await axiosInstance.get(`/user/me/my-cmt-vote?page=${page}`);

  return res.data;
}
