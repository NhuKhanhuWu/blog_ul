/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCmtByBlog } from "../../api/comment.api";
import { useMemo } from "react";

interface GetBlogCmt {
  blogId: string;
  sort: string;
}

function useGetBlogCmt({ blogId, sort }: GetBlogCmt) {
  const {
    data,
    isPending,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["cmt", blogId, sort],
    queryFn: ({ pageParam: page = 0 }) => getCmtByBlog({ blogId, sort, page }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const cmts = useMemo(
    () => data?.pages.flatMap((p) => p.data) || [],
    [data?.pages],
  );

  return {
    cmts,
    isPending,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  };
}

export default useGetBlogCmt;
