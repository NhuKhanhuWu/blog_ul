/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearch } from "../../context/SearchContext";
import { SearchState } from "../../state/searchReducer";
import BlogCard from "./BlogCard";
import { getBlogs } from "../../api/blog/getBlog";
import Loader from "../Loader";
import Error from "../Error";
import styles from "../../styles/component/BlogList.module.scss";
import InfinityObserver from "../InfinityObserver";
import { useIntersectionObserver } from "../../hook/useIntersectionObserver";
import NotFound from "../NotFound";
import { useMemo } from "react";

function getQuery(state: SearchState) {
  const { title, sort, categories, logic } = state;
  let query = `title=${title}&sort=${sort}&logic=${logic}`;

  if (categories.length !== 0) query += `&categories=${categories}`;

  return query;
}

function BlogList() {
  const { state } = useSearch();
  const query = getQuery(state);
  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["blogs", query],
    queryFn: ({ pageParam = 0 }) => getBlogs({ query, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // infinity scoll
  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage || isPending,
    hasNextPage,
  );
  const blogs = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data?.pages],
  );

  if (isPending) return <Loader />;
  if (isError) return <Error />;

  if (blogs.length === 0) return <NotFound message="No result found" />;

  return (
    <div className={styles.blogList}>
      {blogs?.map((blog) => (
        <BlogCard blog={blog} key={blog._id} />
      ))}

      <InfinityObserver lastElementRef={lastElementRef}>
        {isFetchingNextPage && <Loader />}
      </InfinityObserver>
    </div>
  );
}

export default BlogList;
