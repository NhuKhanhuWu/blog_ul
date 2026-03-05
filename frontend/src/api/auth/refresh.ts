/** @format */

import { IAuthResponse } from "../../interface/authTypes";
import axiosInstance from "../../utils/axiosInstance";

async function refresh(): Promise<IAuthResponse> {
  const response = await axiosInstance.post("/user/refresh-token");

  return response.data;
}

export default refresh;
