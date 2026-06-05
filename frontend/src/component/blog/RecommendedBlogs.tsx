/** @format */

import { useMediaQuery } from "react-responsive";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BlogDetailProps } from "../../types/blog.type";
import { getBlogs } from "../../api/blog.api";
import { useIntersectionObserver } from "../../hook/useIntersectionObserver";
import InfinityObserver from "../InfinityObserver";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import BlogCardSm from "./BlogCardSm";
import BlogCardBig from "./BlogCardBig";

function RecommendedBlogs({ curBlog }: { curBlog: BlogDetailProps }) {
  // query recommended blogs based on current blog's categories, using OR logic
  const categories = curBlog.categories?.map((cat) => cat._id).join(",");
  const query = `categories=${categories}&logic=or`;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["recommended-blogs", curBlog._id],
    queryFn: ({ pageParam = 0 }) => getBlogs({ query, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
  const blogs = data?.pages.flatMap((page) => page.data) || [];

  // infinite scroll
  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage || isPending,
    hasNextPage,
  );

  // responsive
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  useEffect(() => {
    if (isError) toast.error("Failed to load recommended blogs");
  }, [isError]);

  /* TODO: style recommed blog component */

  return (
    <>
      {blogs.map((blog) =>
        isDesktop ? (
          <BlogCardSm blog={blog} />
        ) : (
          <BlogCardBig key={blog._id} blog={blog} />
        ),
      )}

      <InfinityObserver lastElementRef={lastElementRef}>
        {(isFetchingNextPage || isPending) && <Loader />}
      </InfinityObserver>
    </>
  );
}

export default RecommendedBlogs;
