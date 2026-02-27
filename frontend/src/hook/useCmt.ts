/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCmtByBlog } from "../api/cmt/getCmt";

interface IUseGetCmtByBlog {
  blogId: string;
  sort: string;
}

export function useGetCmtByBlog({ blogId, sort }: IUseGetCmtByBlog) {
  // get cmt
  const {
    data,
    isPending,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["cmt", sort, blogId],
    queryFn: ({ pageParam = 0 }) => getCmtByBlog({ blogId, sort, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // flat data
  const cmts = data?.pages.flatMap((page) => page?.data) || [];

  return {
    cmts,
    totalCmt: data?.pages[0].totalResult || 0,
    isPending,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  };
}
