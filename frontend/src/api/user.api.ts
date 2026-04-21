/** @format */

import { IUser } from "../types/auth.type";
import axiosInstance from "../utils/axios-instance";

export async function getMe(): Promise<IUser> {
  const response = await axiosInstance.get("/user/me");

  return response.data.user;
}
