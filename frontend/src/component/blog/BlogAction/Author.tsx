/** @format */

import { Link } from "react-router-dom";
import { NormalizedBlog } from "../../../types/blog.type";
import defaultAvatar from "../../../utils/default-avatar";
import styles from "./BlogAction.module.scss";

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

export default Author;
