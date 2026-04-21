/** @format */

import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import Loader from "../Loader.tsx";
import Error from "../Error.tsx";
import { useIntersectionObserver } from "../../hook/useIntersectionObserver.ts";
import InfinityObserver from "../InfinityObserver.tsx";
import { getCmtByBlog } from "../../api/comment.api.ts";
import CmtMinimize from "./CmtMinimize.tsx";
import CmtModal from "./CmtModal.tsx";

interface IBlogInfor {
  blogId: string;
  totalCmts: number;
}

function BlogCmtMobile({ blogId, totalCmts }: IBlogInfor) {
  const [sort, setSort] = useState("top");
  const [isOpen, setIsOpen] = useState(false);

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

  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  );

  return (
    <>
      {/* top cmt/open cmt btn */}
      {!isPending && !isError && (
        <CmtMinimize
          cmts={cmts}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          totalCmts={totalCmts}
        />
      )}

      <CmtModal
        cmts={cmts}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSort={setSort}
        totalCmts={totalCmts}
        blogId={blogId}
        children={
          <>
            {isError && <Error />}
            <InfinityObserver lastElementRef={lastElementRef}>
              {isFetchingNextPage ? <Loader /> : ""}
            </InfinityObserver>
          </>
        }></CmtModal>
    </>
  );
}

function BlogCmt({ blogId, totalCmts }: IBlogInfor) {
  return (
    <>
      <BlogCmtMobile blogId={blogId} totalCmts={totalCmts} />
    </>
  );
}

export default BlogCmt;
