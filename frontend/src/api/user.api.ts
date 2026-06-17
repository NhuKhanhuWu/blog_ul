/** @format */

import { User, UserPublic } from "../types/auth.type";
import axiosInstance from "../utils/axios-instance";

export async function getMe(): Promise<User> {
  const res = await axiosInstance.get("/user/me");

  return res.data.user;
}

export async function getUser(slug: string): Promise<UserPublic> {
  const res = await axiosInstance.get(`/user/${slug}`);

  return res.data;
}
