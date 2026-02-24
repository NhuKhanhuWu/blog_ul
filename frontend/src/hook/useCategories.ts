/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "../api/category/getCategory";
import { ICategoriesResponse } from "../interface/category";

export function useCategories(categoryName?: string) {
  return useInfiniteQuery<ICategoriesResponse, Error>({
    queryKey: ["categories", categoryName],

    initialPageParam: 1,

    queryFn: ({ pageParam, signal }) => {
      if (!navigator.onLine) {
        return Promise.reject(new Error("You are offline."));
      }

      return getCategories(pageParam as number, signal, categoryName);
    },

    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNext ? pages.length + 1 : undefined,

    networkMode: "online",
    retry: false,
  });
}
