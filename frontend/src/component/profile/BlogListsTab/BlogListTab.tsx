/** @format */

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../../hook/shared/reduxHooks";
import { getMultList } from "../../../api/blog-list.api";
import Loader from "../../ui/Loader/Loader";
import { Link } from "react-router-dom";
import styles from "./BlogListTab.module.scss";
import BlogListPopOver from "../../blog-list/BlogListPopOver/BlogListPopOver";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import BlogListForm from "../../blog-list/BlogListForm/BlogListForm";

function CreateListBtn() {
  const [isCreate, setIsCreate] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsCreate(true)}
        className={`btn-secondary ${styles.createListBtn}`}>
        <FiPlus />
        New list
      </button>

      <BlogListForm
        isOpening={isCreate}
        isUpdating={false}
        setIsOpening={setIsCreate}
      />
    </>
  );
}

function BlogLists() {
  const { user } = useAppSelector((state) => state.auth);

  const { data, isPending } = useQuery({
    queryKey: ["blog-list", user?._id],
    queryFn: () => getMultList(user?._id),
  });

  return (
    <div className={styles.blogListsContainer}>
      {isPending && <Loader />}

      {data?.map((list) => (
        <div className={styles.listItem} key={list._id}>
          <Link to={`/list/${list._id}`} className={styles.imgWrapper}>
            <img
              className={styles.img}
              src={list.listAvatar || "/placeholder-img.jpg"}
              loading="lazy"
              alt={list.name}
            />
          </Link>

          <div className={styles.txtContainer}>
            <Link to={`/list/${list._id}`}>
              <p className={styles.name}>{list.name}</p>
              <p style={{ color: "var(--text-muted)" }}>
                {list.isPrivate ? "Privated" : "Public"} • {list.blogsCnt} blogs
              </p>
            </Link>

            <BlogListPopOver blogList={list} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogListsTab() {
  return (
    <>
      <CreateListBtn></CreateListBtn>

      <BlogLists />
    </>
  );
}

export default BlogListsTab;
