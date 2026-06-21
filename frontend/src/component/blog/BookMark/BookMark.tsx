/** @format */
import { MdBookmark, MdOutlineBookmarkBorder } from "react-icons/md";

import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import { useAppSelector } from "../../../hook/reduxHooks";
import { ReactNode, useEffect, useState } from "react";
import ModalOverlay from "../../ui/Modal/Modal";
import useAddBlog from "../../../hook/blog-list/useAddBlog";
import { getMultList } from "../../../api/blog-list.api";
import useRemoveBlog from "../../../hook/blog-list/useRemoveBlog";
import Loader from "../../ui/Loader/Loader";
import LoginMessage from "../../ui/LoginMessageModal/LoginMessage";
import styles from "./BookMark.module.scss";
import BlogListForm from "../../blog-list/BlogListForm/BlogListForm";
import { BlogListSimplify } from "../../../types/blog-list.type";

interface BlogListProps {
  data: BlogListSimplify[] | undefined;
  handleMarkBlog: (listId: string, containsCurrentBlog: boolean) => void;
}

interface BookMarkProps {
  blogId: string;
  openBtn: ReactNode;
}

function BlogList({ data, handleMarkBlog }: BlogListProps) {
  return (
    <>
      {data?.map((list) => (
        <div
          className={styles.bookmarkItem}
          key={list._id}
          onClick={() => handleMarkBlog(list._id, list.containsCurrentBlog)}>
          <div className={styles.bookmarkInfo}>
            <p>{list.name}</p>
            <p>{list.isPrivate ? "Private" : "Public"}</p>
          </div>
          {list.containsCurrentBlog ? (
            <MdBookmark />
          ) : (
            <MdOutlineBookmarkBorder />
          )}
        </div>
      ))}
    </>
  );
}

function BookMark({ blogId, openBtn }: BookMarkProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const user = useAppSelector((state) => state.auth).user;
  const {
    data,
    isPending,
    isError: isGetListErr,
  } = useQuery({
    queryKey: ["blog-list", blogId],
    queryFn: () => getMultList(user?._id, blogId),
    enabled: isOpenModal,
  });

  // creating new list
  const [isCreateList, setIsCreateList] = useState(false);

  // ---------mark blog handling---------
  // add blog to list
  const { mutate: addBlogFn, isSuccess: isAddSuccess } = useAddBlog();

  // remove blog from list
  const { mutate: removeBlogFn, isSuccess: isRemoveSuccess } = useRemoveBlog();

  function handleMarkBlog(listId: string, containsCurrentBlog: boolean) {
    // add blog if the current blog is not in the list
    if (!containsCurrentBlog) addBlogFn({ listId, blogId });
    else removeBlogFn({ listId, blogId }); // else remove blog from list

    // close modal
    setIsOpenModal(false);
  }

  // add blog to list
  useEffect(() => {
    if (isAddSuccess) toast.success("Blog added to list");
  }, [isAddSuccess]);

  // remove blog from list
  useEffect(() => {
    if (isRemoveSuccess) toast.success("Blog remove from list");
  }, [isRemoveSuccess]);
  // ---------mark blog handling---------

  return (
    <>
      {/* modal (lists) */}
      <ModalOverlay isShow={isOpenModal} setIsShow={setIsOpenModal}>
        {/* show this mgs if not login */}
        {!user ? (
          <LoginMessage
            header="Want to save this blog?"
            message="Login to add your favorite blog to your list"></LoginMessage>
        ) : (
          // if login, show bookmark lists
          <div className={styles.bookmarkModal}>
            {/* header */}
            <p className={styles.modalHeader}>Save this blog</p>

            {/* lists */}
            <div className={styles.bookmarkList}>
              {isPending && <Loader />}
              {isGetListErr && (
                <p className="error-mgs">Something went wrong.</p>
              )}

              <BlogList data={data} handleMarkBlog={handleMarkBlog}></BlogList>
            </div>

            {/* create new blog btn */}
            <button
              className="btn-secondary"
              onClick={() => setIsCreateList(true)}>
              <FaPlus />
              New list
            </button>
          </div>
        )}
      </ModalOverlay>

      {/* modal (create list form) */}
      {isCreateList && (
        <BlogListForm
          isOpening={isCreateList}
          setIsOpening={setIsCreateList}
          isUpdating={false}></BlogListForm>
      )}

      {/* bookmark icon */}
      <span onClick={() => setIsOpenModal(!isOpenModal)}>{openBtn}</span>
    </>
  );
}

export default BookMark;
