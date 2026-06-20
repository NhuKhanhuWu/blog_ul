/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/category.api";
import { ICategoriesResponse } from "../../types/category.type";

export function useCategories(categoryName?: string, enabled: boolean = false) {
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
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15, // Keep in garbage collection cache for 15 minutes
    enabled, // Only fetch when explicitly enabled
  });
}
