/** @format */

import { IUser } from "../../interface/authTypes";
import axiosInstance from "../../utils/axiosInstance";

export async function getMe(): Promise<IUser> {
  const response = await axiosInstance.get("/user/me");

  return response.data;
}
