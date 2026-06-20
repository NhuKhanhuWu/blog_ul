/** @format */
import styles from "./BlogAction.module.scss";
import { NormalizedBlog } from "../../../types/blog.type";
import Author from "../Author/Author";
import Vote from "../Vote/Vote";
import Share from "../Share/Share";
import BookMark from "../BookMark/BookMark";
import { MdOutlineBookmarkBorder } from "react-icons/md";

function BlogAction({ blog }: { blog: NormalizedBlog }) {
  const blogListBtn = (
    <div className={styles.icon}>
      <MdOutlineBookmarkBorder />
    </div>
  );

  return (
    <div className={styles.container}>
      <Author blog={blog} />

      {/* ---------- actions ---------- */}
      <div className={styles.actions}>
        <Vote blog={blog} />

        <Share />

        <BookMark blogId={blog._id} openBtn={blogListBtn} />
      </div>
      {/* ---------- actions ---------- */}
    </div>
  );
}

export default BlogAction;
