/** @format */

import { FaRegThumbsUp } from "react-icons/fa";
import { BlogCardProps } from "../../../types/blog.type";
import styles from "./BlogCardBig.module.scss";
import { formatDate } from "../../../utils/date";
import { Link } from "react-router-dom";

function Authors({ blog }: BlogCardProps) {
  const { authors } = blog;
  return (
    <div className="smTxt">
      {authors.slice(0, 5).join(", ")}
      {authors.length > 5 && ", and more."}
    </div>
  );
}

function BlogCardBig({ blog }: BlogCardProps) {
  const placehoderImg =
    "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU";

  return (
    <Link to={`/blog/${blog.slug}`} className={styles.blogCard}>
      <img className={styles.blogImg} src={blog.img || placehoderImg} />

      <div className={styles.blogTxt}>
        <div>
          <Authors blog={blog} />
          <p className="smTxt">{formatDate(blog.pub_date)}</p>
        </div>

        <p className={`font-serif ${styles.title}`}>{blog.title}</p>
        <p className={styles.preview}>{blog.preview.text}</p>

        <div className="vertical-center smTxt">
          <FaRegThumbsUp />
          {blog.upVotes || 0}
        </div>
      </div>

      <div className={styles.borderMobile}></div>
    </Link>
  );
}

export default BlogCardBig;
