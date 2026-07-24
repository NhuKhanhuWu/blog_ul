/** @format */

import { FaRegThumbsUp } from "react-icons/fa";
import { BlogCardProps } from "../../../types/blog.type";
import styles from "./BlogCardBig.module.scss";
import { formatDate } from "../../../utils/date";
import { Link } from "react-router-dom";
import BlogPopOver from "../BlogPopOver/BlogPopOver";

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

function BlogCardBig({ blog, isList, popItems }: BlogCard) {
  const placeholderImg = blog.img || "/placeholder-img.jpg";

  return (
    <div className={`${isList && styles.listMode} ${styles.blogCard}`}>
      <Link to={`/blogs/${blog.slug}`} className={styles.imgWrapper}>
        <img
          className={styles.blogImg}
          src={blog.img || placeholderImg}
          alt={blog.title}
        />
      </Link>

      <div className={styles.blogTxt}>
        <Link to={`/blogs/${blog.slug}`}>
          <div className={styles.metaRow}>
            <Authors blog={blog} />
            <span className={styles.separator}>•</span>
            <p className={styles.dateTxt}>{formatDate(blog.pub_date)}</p>
          </div>

          <h3 className={`font-serif ${styles.title}`}>{blog.title}</h3>
          <p className={styles.preview}>{blog.preview?.text}</p>
        </Link>

        <div className={styles.engagementRow}>
          <div className={styles.upVote}>
            <FaRegThumbsUp />
            <span className={styles.voteCount}>{blog.upVotes || 0}</span>
          </div>

          <div className={styles.popOver}>
            <BlogPopOver blog={blog} popItems={popItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCardBig;
