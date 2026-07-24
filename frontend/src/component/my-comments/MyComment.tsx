/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getCmtByUser } from "../../api/comment.api";
import { useIntersectionObserver } from "../../hook/shared/useIntersectionObserver";
import InfinityObserver from "../ui/InfinityObserver/InfinityObserver";
import Loader from "../ui/Loader/Loader";
import CommentHistory from "./CommentHistory/CommentHistory";

function MyComments() {
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["my-comments"],
      queryFn: ({ pageParam = 0 }) => getCmtByUser(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const comments = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page) => page?.data ?? []);
  }, [data?.pages]);

  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  );

  return (
    <div>
      <CommentHistory comments={comments} />

      <InfinityObserver lastElementRef={lastElementRef}>
        {(isPending || isFetchingNextPage) && <Loader />}
      </InfinityObserver>
    </div>
  );
}

export default MyComments;
