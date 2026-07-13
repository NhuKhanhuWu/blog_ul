/** @format */

import { useInfiniteQuery } from "@tanstack/react-query";
import { UserPublic } from "../../../types/auth.type";
import { getBlogs } from "../../../api/blog.api";
import { useMemo, useState } from "react";
import BlogCardBig from "../../blog/BlogCardBig/BlogCardBig";
import styles from "./BlogsTab.module.scss";
import Loader from "../../ui/Loader/Loader";

interface BlogsTabProps {
  user?: UserPublic;
}

function BlogsTab({ user }: BlogsTabProps) {
  const [sort, setSort] = useState("-createdAt"); // -createAt (newest), -upVotes (popular)

  const { data, isPending } = useInfiniteQuery({
    queryKey: ["user-blogs", user?._id, sort],
    queryFn: ({ pageParam = 0 }) =>
      getBlogs({ query: `userId=${user?._id}&sort=${sort}`, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const blogs = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data?.pages],
  );

  return (
    <div>
      <div className={styles.sortOption}>
        <label>Sort by</label>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="-updatedAt">Newest</option>
          <option value="-upVotes">Popular</option>
        </select>
      </div>

      <div className={styles.blogsContainer}>
        {isPending && <Loader />}

        {blogs.map((blog) => (
          <BlogCardBig blog={blog} key={blog._id} />
        ))}
      </div>
    </div>
  );
}

export default BlogsTab;
