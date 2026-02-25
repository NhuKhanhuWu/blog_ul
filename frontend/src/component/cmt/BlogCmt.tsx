/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCmtByBlog } from "../../api/cmt/getCmt";

function BlogCmt({ blogId }: { blogId: string }) {
  // get cmt
  // const { data, isPending, isFetchingNextPage, isError } = useInfiniteQuery({
  //   queryKey: ["cmt"],
  //   queryFn: () => getCmtByBlog(blogId),
  //   getNextPageParam: (lastPage) => lastPage.nextPage,
  // });

  return <div></div>;
}
