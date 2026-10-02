/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { UserPublic } from "../../../types/auth.type";
import { getMyBlogs } from "../../../api/blog.api";
import { MyBlogStatus } from "../../../types/blog.type";
import { useMemo, useState } from "react";
import BlogCardBig from "../../blog/BlogCardBig/BlogCardBig";
import styles from "./BlogsTab.module.scss";
import Loader from "../../ui/Loader/Loader";

interface BlogsTabProps {
  user?: UserPublic;
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

  return (
    <div>
      <div className={styles.sortOption}>
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

        <label htmlFor="blog-sort">Sort by</label>
        <select
          id="blog-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}>
          <option value="-updatedAt">Recently updated</option>
          {status !== "draft" && <option value="-upVotes">Popular</option>}
        </select>
      </div>

      <div className={styles.blogsContainer}>
        {isPending && <Loader />}
        {isError && <p className="error-mgs">{error.message}</p>}
        {!isPending && !isError && blogs.length === 0 && <p>No blogs found.</p>}

        {blogs.map((blog) => (
          <BlogCardBig blog={blog} key={blog._id} />
        ))}
      </div>
    </div>
  );
}

export default BlogsTab;
