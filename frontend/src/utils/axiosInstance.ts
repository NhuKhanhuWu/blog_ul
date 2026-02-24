/** @format */

import axios from "axios";

const BASE_URL: string = import.meta.env.VITE_SERVER_URL || "";
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 5000, // 5 giây
});

export default axiosInstance;
