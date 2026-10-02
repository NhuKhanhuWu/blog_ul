/** @format */

import { ICategoriesResponse } from "../types/category.type";
import axiosInstance from "../utils/core/axios-instance";

export async function getCategories(
  page: number,
  signal?: AbortSignal,
  categoryName?: string,
): Promise<ICategoriesResponse> {
  const checkedQuery = `?page=${page || 0}&name=${categoryName || ""}`;

  const response = await axiosInstance.get(`/category${checkedQuery}`, {
    signal,
  });

  return response.data;
}
