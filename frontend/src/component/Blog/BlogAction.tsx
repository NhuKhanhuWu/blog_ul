/** @format */

import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";

import { TNormalizedBlog } from "../../interface/blogTypes";
import defaultAvatar from "../../utils/defaultAvatar";
import styles from "../../styles/component/BlogAction.module.scss";
import { MdBookmark, MdOutlineBookmarkBorder } from "react-icons/md";

function BlogAction({ blog }: { blog: TNormalizedBlog }) {
  const avatar = blog.userId.avatar || defaultAvatar(blog.userId.name);
  // TODO: handle vote blog
  // TODO: handle share blog
  // TODO: handle mark blog
  return (
    <div className={styles.wrapper}>
      {/* ---------- author ---------- */}
      <div className={styles.author}>
        <img src={avatar} alt="avatar" />
        <p className={styles.name}>{blog.userId.name}</p>
      </div>
      {/* ---------- author ---------- */}

      {/* ---------- actions ---------- */}
      <div className={styles.actions}>
        {/* upvote */}
        <div className={styles.votes}>
          <span className={styles.icon}>
            {/* <FaThumbsUp /> fill */}
            <FaRegThumbsUp />
            {blog.upVotes > 0 && blog.upVotes}
          </span>

          {/* downvote */}
          <span className={styles.icon}>
            {/* <FaThumbsDown /> fill */}
            <FaRegThumbsDown />
          </span>
        </div>

        {/* share */}
        <span className={styles.icon}>
          <PiShareFatBold />
        </span>

        {/* bookmark */}
        <span className={styles.icon}>
          <MdOutlineBookmarkBorder />
          {/* <MdBookmark /> */}
        </span>
      </div>
      {/* ---------- actions ---------- */}
    </div>
  );
}

export default BlogAction;
