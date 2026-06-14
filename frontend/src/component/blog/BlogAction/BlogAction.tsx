/** @format */
import styles from "./BlogAction.module.scss";
import { NormalizedBlog } from "../../../types/blog.type";
import Author from "./Author";
import Vote from "./Vote";
import Share from "./Share";
import BookMark from "./BookMark";

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
