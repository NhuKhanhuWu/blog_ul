/** @format */

import axiosInstance from "../utils/axios-instance";
import { AuthResponse, Login } from "../types/auth.type";

export async function login({ email, password }: Login): Promise<AuthResponse> {
  const response = await axiosInstance.post("/user/login", {
    email,
    password,
  });

  return response.data;
}

export async function logout() {
  await axiosInstance.post("/user/logout");
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await axiosInstance.post(
    "/user/refresh-token",
    {},
    { withCredentials: true },
  );

  return response.data;
}
