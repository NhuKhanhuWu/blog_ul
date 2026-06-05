/** @format */
import { FaRegThumbsUp } from "react-icons/fa";
import styles from "../../styles/component/BlogCardSm.module.scss";
import { BlogCardProps } from "../../types/blog.type";
import { Link } from "react-router-dom";
import { getDateDistance } from "../../utils/date";

function BlogCardSm({ blog }: BlogCardProps) {
  const placehoderImg =
    "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU";

  return (
    <Link to={`/blog/${blog.slug}`} className={styles.card}>
      {/* 1. Blog Image / Thumbnail */}
      <div className={styles.thumbnailWrapper}>
        <img className={styles.blogImg} src={blog.img || placehoderImg} />
      </div>

      {/* 2. Blog Content */}
      <div className={styles.content}>
        <p className={styles.title}>{blog.title}</p>

        <p className={styles.authors}>
          {blog.authors.length > 0
            ? `By ${blog.authors.join(", ")}`.slice(0, 10)
            : "Anonymous"}
        </p>

        <div className={styles.meta}>
          <p className={styles.date}>{getDateDistance(blog.pub_date)}</p>
          <span className={styles.separator}>•</span>
          <div className="vertical-center smTxt">
            <FaRegThumbsUp />
            {blog.upVotes || 0}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BlogCardSm;
