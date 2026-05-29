/** @format */

import { ICategoriesResponse } from "../types/category.type";
import axiosInstance from "../utils/axios-instance";

export async function getCategories(
  page: number,
  signal?: AbortSignal,
  categoryName?: string,
): Promise<ICategoriesResponse> {
  const checkedQuery = `?page=${page}&name=${categoryName}`;

  const response = await axiosInstance.get(`/categories${checkedQuery}`, {
    signal,
  });

  return response.data;
}
