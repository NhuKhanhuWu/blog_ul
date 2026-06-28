/** @format */

import axiosInstance from "../utils/axios-instance";
import {
  AuthResponse,
  Login,
  SignUpOtpArgs,
  SignUpOtpResponse,
} from "../types/auth.type";

export async function login({ email, password }: Login): Promise<AuthResponse> {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function logout() {
  await axiosInstance.post("/auth/logout");
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await axiosInstance.post(
    "/auth/refresh-token",
    {},
    { withCredentials: true },
  );

  return response.data;
}

// sign up
export async function signUpEmailStep(email: string) {
  const response = await axiosInstance.post("/auth/signup", { email });

  return response.data;
}

export async function signUpOtpStep({
  email,
  otp,
}: SignUpOtpArgs): Promise<SignUpOtpResponse> {
  const response = await axiosInstance.post("/auth/signup/verify", {
    email,
    otp,
  });

  return response.data;
}
