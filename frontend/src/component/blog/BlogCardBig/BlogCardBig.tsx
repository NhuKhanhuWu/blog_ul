/** @format */

import { FaRegThumbsUp } from "react-icons/fa";
import { BlogCardProps } from "../../../types/blog.type";
import styles from "./BlogCardBig.module.scss";
import { formatDate } from "../../../utils/date";
import { Link } from "react-router-dom";

interface BlogCard extends BlogCardProps {
  isList?: boolean;
}

function Authors({ blog }: BlogCard) {
  const { authors } = blog;
  return (
    <p className={`${styles.author} smTxt`}>
      {authors.slice(0, 5).join(", ")}
      {authors.length > 5 && ", and more."}
    </p>
  );
}

function BlogCardBig({ blog, isList }: BlogCard) {
  const placeholderImg =
    "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU";
  // placeholder-img.jpg

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className={`${isList && styles.listMode} ${styles.blogCard}`}>
      <div className={styles.imgWrapper}>
        <img
          className={styles.blogImg}
          src={blog.img || placeholderImg}
          alt={blog.title}
        />
      </div>

      <div className={styles.blogTxt}>
        <div className={styles.metaRow}>
          <Authors blog={blog} />
          <span className={styles.separator}>•</span>
          <p className={styles.dateTxt}>{formatDate(blog.pub_date)}</p>
        </div>

        <h3 className={`font-serif ${styles.title}`}>{blog.title}</h3>
        <p className={styles.preview}>{blog.preview.text}</p>

        <div className={styles.engagementRow}>
          <FaRegThumbsUp />
          <span className={styles.voteCount}>{blog.upVotes || 0}</span>
        </div>
      </div>
    </Link>
  );
}

export default BlogCardBig;
