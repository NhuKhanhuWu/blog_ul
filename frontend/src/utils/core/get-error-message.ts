/** @format */

import axios from "axios";

interface ApiErrorResponse {
  status?: string;
  message?: string;
  errors?: {
    path: string;
    message: string;
  }[];
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;

    if (data?.errors?.length) {
      return data.errors.map((err) => err.message).join(", ");
    }

    if (data?.message) {
      return data.message;
    }

    return error.message || "An unexpected error occurred";
  }

  // Fallback in case the error is not recognized as AxiosError
  const responseData = (
    error as {
      response?: {
        data?: ApiErrorResponse;
      };
    }
  )?.response?.data;

  if (responseData?.errors?.length) {
    return responseData.errors.map((err) => err.message).join(", ");
  }

  if (responseData?.message) {
    return responseData.message;
  }

  return "An unexpected error occurred";
}
