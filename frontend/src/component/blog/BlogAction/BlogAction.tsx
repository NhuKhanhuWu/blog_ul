/** @format */

import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import {
  MdBookmark,
  MdOutlineBookmarkBorder,
  MdOutlineContentCopy,
} from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FacebookShareButton,
  FacebookIcon,
  XShareButton,
  XIcon,
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
} from "react-share";

import styles from "./BlogAction.module.scss";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { NormalizedBlog } from "../../../types/blog.type";
import defaultAvatar from "../../../utils/default-avatar";
import { useToggleBlogVote } from "../../../hook/useToggleVote";
import { useAppSelector } from "../../../hook/reduxHooks";
import { useEffect, useState } from "react";
import ModalOverlay from "../../ui/Modal/Modal";
import useAddBlog from "../../../hook/blog-list/useAddBlog";
import { getMultBlogList } from "../../../api/blog-list.api";
import useRemoveBlog from "../../../hook/blog-list/useRemoveBlog";
import Loader from "../../ui/Loader/Loader";
import axios from "axios";
import LoginMessage from "../../ui/LoginMessageModal/LoginMessage";

function Author({ blog }: { blog: NormalizedBlog }) {
  const name = blog?.userId?.name || "Unknown";
  const avatar = blog?.userId?.avatar || defaultAvatar(name);

  return (
    <>
      {blog.userId?.slug ? (
        <Link to={`/profile/${blog.userId?.slug}`} className={styles.author}>
          <img src={avatar} alt="avatar" />
          <p className={styles.name}>{name}</p>
        </Link>
      ) : (
        <span className={styles.author}>
          <img src={avatar} alt="avatar" />
          <p className={styles.name}>{name}</p>
        </span>
      )}
    </>
  );
}

function Vote({ blog }: { blog: NormalizedBlog }) {
  const { mutate, isPending, isError, error } = useToggleBlogVote(blog.slug);
  const isLogin = useAppSelector((state) => state.auth.isAuthenticated);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleVote = (type: 1 | -1) => {
    if (!isLogin) {
      setIsOpenModal(true);
      return;
    }

    if (isPending) return;
    mutate({ targetId: blog._id, voteType: type, targetType: "blog" });
  };

  if (isError && axios.isAxiosError(error) && error.response?.status === 429) {
    toast.error("Voting too fast. Please wait a moment");
  }

  return (
    <div className={`${styles.votes} btn`}>
      {/* not login modal */}
      <ModalOverlay isShow={isOpenModal} setIsShow={setIsOpenModal}>
        <LoginMessage
          header="Want to votw this blog"
          message="Login to vote for your favorite blog"
        />
      </ModalOverlay>

      {/* upvote */}
      <span className={styles.icon} onClick={() => handleVote(1)}>
        {blog.voteType === 1 ? <FaThumbsUp /> : <FaRegThumbsUp />}
        {blog.upVotes > 0 && blog.upVotes}
      </span>

      {/* downvote */}
      <span className={styles.icon} onClick={() => handleVote(-1)}>
        {blog.voteType === -1 ? <FaThumbsDown /> : <FaRegThumbsDown />}
      </span>
    </div>
  );
}

function Share() {
  const [isSharing, setIsSharing] = useState(false);
  const url = window.location.href;
  const iconSize = 50;

  return (
    <>
      {isSharing && (
        <ModalOverlay isShow={isSharing} setIsShow={setIsSharing}>
          <div className={styles.shareContainer}>
            <p className={styles.modalHeader}>Share this blog</p>

            <div className={styles.shareIcons}>
              <FacebookShareButton url={url}>
                <FacebookIcon size={iconSize} round />
              </FacebookShareButton>
              <XShareButton url={url}>
                <XIcon size={iconSize} round />
              </XShareButton>
              <EmailShareButton url={url}>
                <EmailIcon size={iconSize} round />
              </EmailShareButton>
              <LinkedinShareButton url={url}>
                <LinkedinIcon size={iconSize} round />
              </LinkedinShareButton>
              <RedditShareButton url={url}>
                <RedditIcon size={iconSize} round />
              </RedditShareButton>
            </div>

            <div className={styles.shareCopy}>
              <input type="text" value={url} disabled></input>
              <CopyToClipboard text={url}>
                <MdOutlineContentCopy
                  onClick={() => toast.success("Copied!")}
                />
              </CopyToClipboard>
            </div>
          </div>
        </ModalOverlay>
      )}

      <span className={styles.icon}>
        <PiShareFatBold onClick={() => setIsSharing(!isSharing)} />
      </span>
    </>
  );
}

function BookMark({ blogId }: { blogId: string }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const user = useAppSelector((state) => state.auth).user;
  const {
    data,
    isPending,
    isError: isGetListErr,
  } = useQuery({
    queryKey: ["blog-list", blogId],
    queryFn: () => getMultBlogList(user?._id, blogId),
    enabled: isOpenModal,
  });

  // ---------mark blog handling---------
  // add blog to list
  const {
    mutate: addBlogFn,
    isSuccess: isAddSuccess,
    isError: isAddErr,
  } = useAddBlog(blogId);

  // remove blog from list
  const {
    mutate: removeBlogFn,
    isSuccess: isRemoveSuccess,
    isError: isRemoveErr,
  } = useRemoveBlog(blogId);

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
    if (isAddErr)
      toast.error("Cannot add blog to list, please try again later");
  }, [isAddSuccess, isAddErr]);

  // remove blog from list
  useEffect(() => {
    if (isRemoveSuccess) toast.success("Blog remove from list");
    if (isRemoveErr)
      toast.error("Cannot remove blog from list, please try again later");
  }, [isRemoveSuccess, isRemoveErr]);

  return (
    <>
      {/* modal */}
      <ModalOverlay isShow={isOpenModal} setIsShow={setIsOpenModal}>
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

              {data?.map((list) => (
                <div
                  className={styles.bookmarkItem}
                  key={list._id}
                  onClick={() =>
                    handleMarkBlog(list._id, list.containsCurrentBlog)
                  }>
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
            </div>

            {/* create new blog btn */}
            <button className="btn-secondary">
              <FaPlus />
              New list
            </button>
          </div>
        )}
      </ModalOverlay>

      {/* bookmark icon */}
      <span
        className={styles.icon}
        onClick={() => setIsOpenModal(!isOpenModal)}>
        <MdOutlineBookmarkBorder />
      </span>
    </>
  );
}

function BlogAction({ blog }: { blog: NormalizedBlog }) {
  return (
    <div className={styles.container}>
      <Author blog={blog} />

      {/* ---------- actions ---------- */}
      <div className={styles.actions}>
        <Vote blog={blog} />
        <Share />
        <BookMark blogId={blog._id} />
      </div>
      {/* ---------- actions ---------- */}
    </div>
  );
}

export default BlogAction;
