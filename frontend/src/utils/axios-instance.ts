/** @format */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { setAccessToken } from "../redux/auth.slice";
import { refreshToken } from "../api/auth.api";

interface IRetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL: string = import.meta.env.VITE_SERVER_URL || "";
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 5000, // 5 seconds
  withCredentials: true,
});

// ------------attach accessToken------------
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const state = store.getState();
  const token = state.auth.accessToken;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// request access token && handle request queue
let isRefreshing = false;
let failQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function proccessQueue(error: unknown, token: string | null = null) {
  failQueue.forEach((process) => {
    if (error) process.reject(error);
    else if (token) process.resolve(token);
  });

  failQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const ogRequest = error.config as IRetryAxiosRequestConfig;

    // login and refresh-token requests does not trigger the refresh interceptor
    if (
      ogRequest.url?.includes("/user/login") ||
      ogRequest.url?.includes("/user/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // if no response => reject
    if (!error.response) return Promise.reject(error);

    // if 401 & not retry
    if (error.response.status === 401 && !ogRequest._retry) {
      if (isRefreshing) {
        // Return a clean promise chain that correctly propagates errors down to the UI
        return new Promise((resolve, reject) => {
          failQueue.push({ resolve, reject });
        })
          .then((token) => {
            ogRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(ogRequest);
          })
          .catch((err) => {
            // Correctly reject the final chain so the calling code knows it failed
            return Promise.reject(err);
          });
      }

      ogRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshToken();
        const newAccessToken = response.accessToken || "";

        store.dispatch(setAccessToken(newAccessToken));
        proccessQueue(null, newAccessToken);

        ogRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(ogRequest);
      } catch (refreshError) {
        // Refresh token failed (User is not logged in)
        proccessQueue(refreshError, null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
