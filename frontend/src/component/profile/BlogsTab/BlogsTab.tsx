/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { UserPublic } from "../../../types/auth.type";
import { getMyBlogs } from "../../../api/blog.api";
import { MyBlogStatus } from "../../../types/blog.type";
import { useMemo, useState } from "react";
import BlogCardBig from "../../blog/BlogCardBig/BlogCardBig";
import styles from "./BlogsTab.module.scss";
import Loader from "../../ui/Loader/Loader";
import { useMediaQuery } from "react-responsive";
import BlogCardSm from "../../blog/BlogCardSm/BlogCardSm";

interface BlogsTabProps {
  user?: UserPublic;
}

interface SortOptionsProps {
  status: MyBlogStatus;
  setStatus: (status: MyBlogStatus) => void;
  setSort: (sort: string) => void;
  sort: string;
}

function SortOptions({ status, setStatus, setSort, sort }: SortOptionsProps) {
  return (
    <div className={styles.sortOption}>
      <div>
        <label htmlFor="blog-status">Show</label>
        <select
          id="blog-status"
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value as MyBlogStatus;
            setStatus(nextStatus);
            if (nextStatus === "draft") setSort("-updatedAt");
          }}>
          <option value="all">All blogs</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <div>
        <label htmlFor="blog-sort">Sort by</label>
        <select
          id="blog-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}>
          <option value="-updatedAt">Recently updated</option>
          {status !== "draft" && <option value="-upVotes">Popular</option>}
        </select>
      </div>
    </div>
  );
}

function BlogsTab({ user }: BlogsTabProps) {
  const [status, setStatus] = useState<MyBlogStatus>("all");
  const [sort, setSort] = useState("-updatedAt");

  const { data, isPending, isError, error } = useInfiniteQuery({
    queryKey: ["my-blogs", user?._id, status, sort],
    queryFn: ({ pageParam = 0 }) => getMyBlogs({ status, sort, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: Boolean(user?._id),
  });

  const blogs = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data?.pages],
  );

  // responsive
  const isMobile = useMediaQuery({
    query: "(max-width: 520px)",
  });

  return (
    <div>
      <SortOptions
        setSort={setSort}
        setStatus={setStatus}
        sort={sort}
        status={status}
      />

      <div className={styles.blogsContainer}>
        {isPending && <Loader />}
        {isError && <p className="error-mgs">{error.message}</p>}
        {!isPending && !isError && blogs.length === 0 && <p>No blogs found.</p>}

        {blogs.map((blog) => (
          <>
            {isMobile ? (
              <BlogCardSm blog={blog} key={blog._id} />
            ) : (
              <BlogCardBig blog={blog} key={blog._id} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default BlogsTab;
