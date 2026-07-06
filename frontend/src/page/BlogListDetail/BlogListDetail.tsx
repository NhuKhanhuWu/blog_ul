/** @format */

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBlogFromList, getListMetaData } from "../../api/blog-list.api";
import { useMemo } from "react";
import NotFound from "../../component/ui/NotFound/NotFound";
import Loader from "../../component/ui/Loader/Loader";
import BlogCardBig from "../../component/blog/BlogCardBig/BlogCardBig";
import styles from "./BlogListDetail.module.scss";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import useRemoveBlog from "../../hook/blog-list/useRemoveBlog";
import toast from "react-hot-toast";
import EditBlogListBtn from "../../component/blog-list/EditBlogListBtn/EditBlogListBtn";
import DeleteBlogListBtn from "../../component/blog-list/DeleteBlogListBtn/DeleteBlogListBtn";
import { ShowMoreText } from "../../component/ui/ShowMoreText/ShowMoreText";

interface RemoveBlogFromListProps {
  blogId: string;
  listId: string;
}

function RemoveBlogFromList({ blogId, listId }: RemoveBlogFromListProps) {
  const { mutate } = useRemoveBlog();

  function handleRemove() {
    mutate(
      { listId, blogId },
      {
        onSuccess: () => {
          toast.success("Blog removed");
        },
      },
    );
  }

  return (
    <button className={styles.popItem} onClick={() => handleRemove()}>
      <MdDeleteOutline className={styles.icon} /> Remove from list
    </button>
  );
}

function Header() {
  const { id: listId = "" } = useParams();

  const { data: listMetaData } = useQuery({
    queryKey: ["blog-list-infor", listId],
    queryFn: () => getListMetaData(listId),
  });

  if (!listMetaData) return <NotFound message="List not found" />;

  return (
    <div className={styles.headerBanner}>
      {/* title */}
      <h1>{listMetaData?.name}</h1>

      {/* meta txt (isPrivate, description, blog cnt, etc) */}
      <div className={styles.metaText}>
        <p>
          <span>{listMetaData?.blogsCnt} blogs</span>
          <span className={styles.separator}> • </span>
          <span>{listMetaData?.isPrivate ? "Private" : "Public"}</span>
        </p>

        <ShowMoreText text={listMetaData.description} lines={1} />
      </div>

      {/* btns (edit, delete) */}
      <div className={styles.headerBtns}>
        <EditBlogListBtn
          listId={listMetaData._id}
          btnContent={
            <span>
              <MdEdit />
            </span>
          }
        />

        <DeleteBlogListBtn
          blogListId={listMetaData._id}
          btnContent={
            <span>
              <MdDeleteOutline />
            </span>
          }
        />
      </div>
    </div>
  );
}

function BlogListDetail() {
  const { id: listId = "" } = useParams();

  const { data: blogsData, isPending: isPendingBlogs } = useInfiniteQuery({
    queryKey: ["list-detail", listId],
    queryFn: () => getBlogFromList(listId),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextPage,
  });
  const blogs = useMemo(
    () => blogsData?.pages.flatMap((page) => page.data) ?? [],
    [blogsData?.pages],
  );

  if (isPendingBlogs) return <Loader />;

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* Content List Container */}
      <div className={styles.blogsContainer}>
        {blogs.map((blog) => (
          <BlogCardBig
            blog={blog}
            key={blog._id}
            popItems={<RemoveBlogFromList blogId={blog._id} listId={listId} />}
          />
        ))}
      </div>
    </div>
  );
}

export default BlogListDetail;
