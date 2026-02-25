/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCmtByBlog } from "../../api/cmt/getCmt";
import { useState } from "react";

function BlogCmt({ blogId }: { blogId: string }) {
  // sort options
  const [sort, setSort] = useState("upVotes");

  // get cmt
  const { data, isPending, isFetchingNextPage, isError } = useInfiniteQuery({
    queryKey: ["cmt"],
    queryFn: ({ pageParam = 0 }) => getCmtByBlog({ blogId, sort, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // flat data
  const cmts = data?.pages.flatMap((page) => page?.data) || [];
  // console.log(cmts);

  return <div></div>;
}

export default BlogCmt;
