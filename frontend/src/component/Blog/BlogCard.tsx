/** @format */

import { IBlogCard } from "../../interface/blog";
import styles from "../../styles/component/BlogList.module.scss";
import formatDate from "../../utils/fomatDate";

function Authors({ blog }: IBlogCard) {
  const { authors } = blog;
  return (
    <div>
      {authors.slice(0, 5).join(", ")}
      {authors.length > 5 && ", and more."}
    </div>
  );
}

function BlogCard({ blog }: IBlogCard) {
  // console.log(blog);

  return (
    <div className={styles.blogCard}>
      <Authors blog={blog} />
      <p>{formatDate(blog.pub_date)}</p>
      <p>{blog.title}</p>
      <p>{blog.preview.text}</p>
      <div>{blog.voteScore}</div>
    </div>
  );
}

export default BlogCard;
