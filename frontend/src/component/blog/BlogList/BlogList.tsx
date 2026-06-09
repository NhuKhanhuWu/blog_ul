/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearch } from "../../../context/SearchContext";
import { SearchState } from "../../../reducer/search.reducer";
import BlogCardBig from "../BlogCardBig/BlogCardBig";
import { getBlogs } from "../../../api/blog.api";
import Loader from "../../ui/Loader/Loader";
import Error from "../../ui/Error/Error";
import styles from "./BlogList.module.scss";
import InfinityObserver from "../../ui/InfinityObserver/InfinityObserver";
import { useIntersectionObserver } from "../../../hook/useIntersectionObserver";
import NotFound from "../../ui/NotFound/NotFound";
import { useMemo, useState } from "react";
import { FaList } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";

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
  const totalResult = data?.pages[0].totalResult ?? 0;
  const blogs = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data?.pages],
  );

  // infinity scoll
  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage || isPending,
    hasNextPage,
  );

  // view mode
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  if (isPending) return <Loader />;
  if (isError) return <Error />;

  if (blogs.length === 0) return <NotFound message="No result found" />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>{totalResult} blog(s) found</p>

        <div className={styles.viewToggle}>
          <button
            className={viewMode === "grid" ? styles.active : ""}
            onClick={() => setViewMode("grid")}>
            <FiGrid />
          </button>

          <button
            className={viewMode === "list" ? styles.active : ""}
            onClick={() => setViewMode("list")}>
            <FaList />
          </button>
        </div>
      </div>

      <div
        className={`${styles.blogList} ${viewMode === "list" && styles.listMode}`}>
        {blogs?.map((blog) => (
          <BlogCardBig
            isList={viewMode === "list"}
            blog={blog}
            key={blog._id}
          />
        ))}

        <InfinityObserver lastElementRef={lastElementRef}>
          {isFetchingNextPage && <Loader />}
        </InfinityObserver>
      </div>
    </div>
  );
}

export default BlogList;
