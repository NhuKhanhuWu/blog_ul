/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyCmtVotes } from "../../../api/user.api";
import { useMemo } from "react";
import { useIntersectionObserver } from "../../../hook/shared/useIntersectionObserver";
import InfinityObserver from "../../ui/InfinityObserver/InfinityObserver";
import Loader from "../../ui/Loader/Loader";
import { groupDataByDate } from "../../../utils/groupItemByDate";
import VoteHistory from "../VoteHistory/VoteHistory";

function CommentVotes() {
  // get data from be
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["my-cmt-votes"],
      queryFn: ({ pageParam = 0 }) => getMyCmtVotes({ page: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  // process data
  const votes = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page) => {
      return page?.data ?? [];
    });
  }, [data?.pages]);

  // 1. Add an empty array guard so we don't process nothing
  // 2. Add optional chaining (?.) inside the selector in case an invalid object slips through
  const groupedVotes = useMemo(() => {
    if (!votes.length) return {};
    return groupDataByDate(votes, (item) => item?.createdAt);
  }, [votes]);

  // fetch next page (infinity scroll)
  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  );

  return (
    <div>
      <VoteHistory groupedVotes={groupedVotes} />

      <InfinityObserver lastElementRef={lastElementRef}>
        {(isPending || isFetchingNextPage) && <Loader />}
      </InfinityObserver>
    </div>
  );
}

export default CommentVotes;
