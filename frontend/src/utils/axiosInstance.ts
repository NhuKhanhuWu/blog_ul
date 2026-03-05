/** @format */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { setAccessToken } from "../redux/authSlice";

interface IRetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL: string = import.meta.env.VITE_SERVER_URL || "";
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 5000, // 5 seconds
  withCredentials: true,
});

// ------------interceptors------------
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const state = store.getState();
  const token = state.auth.accessToken;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});
// ------------interceptors------------

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

    // if no response => reject
    if (!error.response) return Promise.reject(error);

    // if 401 & not retry
    if (error.response.status === 401 && !ogRequest._retry) {
      // if is requesting new token
      if (isRefreshing) {
        return (
          new Promise((resolve, reject) => {
            // push to queue (store request need to retry => currently sleep)
            failQueue.push({ resolve, reject });
          })
            // retry reuquest after awake
            .then((token) => {
              ogRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(ogRequest);
            })
        );
      }

      ogRequest._retry = true; // mark is retry
      isRefreshing = true; // turn on refreshing token flag

      // request new token
      try {
        const response = await axiosInstance.post(
          `${BASE_URL}/user/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = response.data.accessToken;

        // store new token in redux
        store.dispatch(setAccessToken(newAccessToken));

        // awake sleeping request
        proccessQueue(null, newAccessToken);

        // retry the first request that trigger the refresh token request
        ogRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(ogRequest);
      } catch (error) {
        proccessQueue(error, null);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
