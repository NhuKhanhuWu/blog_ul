/** @format */

import styles from "./BlogInfor.module.scss";
import { NormalizedBlog } from "../../../types/blog.type.ts";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/date.ts";
import BlogAction from "../BlogAction/BlogAction.tsx";
import "@blocknote/mantine/style.css";
import BlogContent from "../BlogContent/BlogContent.tsx";

function Categories({ blog }: { blog: NormalizedBlog }) {
  return (
    <div className={styles.categoriesContainer}>
      <div>Categories:</div>

      <div className={styles.categories}>
        {blog.categories.map((cat) => (
          <Link
            key={cat._id}
            className={`btn-secondary ${styles.category}`}
            to={{
              pathname: "/",
              search: `?category=${cat._id}`,
            }}>
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function BlogInfor({ blog }: { blog: NormalizedBlog }) {
  return (
    <>
      <p className={`smTxt ${styles.meta}`}>
        {blog?.authors?.join(", ")} • {formatDate(blog?.pub_date || "")}
      </p>

      <h1 className={styles.title}>{blog?.title}</h1>

      <BlogContent blog={blog} />
      <BlogAction blog={blog} />

      <Categories blog={blog} />
    </>
  );
}

export default BlogInfor;
