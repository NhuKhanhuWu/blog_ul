/** @format */
import { FaRegThumbsUp } from "react-icons/fa";
import styles from "./BlogCardSm.module.scss";
import { BlogCardProps } from "../../../types/blog.type";
import { Link } from "react-router-dom";
import { getDateDistance } from "../../../utils/date";
import BlogPopOver from "../BlogPopOver/BlogPopOver";

function BlogCardSm({ blog, popItems }: BlogCardProps) {
  const placehoderImg = blog.img || "/placeholder-img.jpg";
  // placeholder-img.jpg

  return (
    <div className={styles.card}>
      {/* 1. Blog Image / Thumbnail */}
      <Link to={`/blogs/${blog.slug}`} className={styles.thumbnailWrapper}>
        <img className={styles.blogImg} src={blog.img || placehoderImg} />
      </Link>

      {/* 2. Blog Content */}
      <div className={styles.content}>
        <Link to={`/blogs/${blog.slug}`} className={styles.title}>
          {blog.title}
        </Link>

        <p className={styles.authors}>
          {blog.authors.length > 0
            ? `By ${blog.authors.join(", ")}`.slice(0, 10)
            : "Anonymous"}
        </p>

        <div className={styles.meta}>
          <p className={styles.date}>{getDateDistance(blog.pub_date)}</p>
          <span className={styles.separator}>•</span>

          <div className={`vertical-center smTxt ${styles.like}`}>
            <FaRegThumbsUp />
            {blog.upVotes || 0}
          </div>

          <div style={{ marginLeft: "auto" }}>
            <BlogPopOver blog={blog} popItems={popItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCardSm;
