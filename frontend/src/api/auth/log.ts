/** @format */

import axiosInstance from "../../utils/axiosInstance";
import { IAuthResponse, ILogin } from "../../interface/authTypes";

export async function login({
  email,
  password,
}: ILogin): Promise<IAuthResponse> {
  const response = await axiosInstance.post("/user/login", {
    email,
    password,
  });

  return response.data;
}

export async function logout() {
  await axiosInstance.post("/user/logout");
}
