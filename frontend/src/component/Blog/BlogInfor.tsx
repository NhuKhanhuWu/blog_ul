/** @format */

import styles from "../../styles/component/BlogDetail.module.scss";
import { INormalizedBlog, NormalizedContent } from "../../interface/blog";
import { Link } from "react-router-dom";
import formatDate from "../../utils/fomatDate";

function ContentItem({ item }: { item: NormalizedContent }) {
  // title
  if (item.type === "title")
    return <p className={styles.sectionTitle}>{item.text}</p>;

  // section
  if (item.type === "section")
    return <p className={styles.sectionHeader}>{item.text}</p>;

  // quote
  if (item.type === "quote")
    return <blockquote className={styles.qoute}>{item.text}</blockquote>;

  // highlight
  if (item.type === "highlight")
    return <p className={styles.highlight}>{item.text}</p>;

  // meta
  if (item.type === "meta") return <p className={styles.meta}>{item.text}</p>;

  // img
  if (item.type === "image") {
    return (
      <div className={styles.img}>
        <img src={item.img} loading="lazy" />
        <p className={styles.imgNote}>{item.note}</p>
      </div>
    );
  }

  return <p className={styles.paragraph}>{item.text}</p>;
}

function BlogContent({ blog }: { blog: INormalizedBlog }) {
  return (
    <div className={styles.blogContent}>
      {blog.content.map((item, index) => (
        <ContentItem item={item} key={index} />
      ))}
    </div>
  );
}

function Categories({ blog }: { blog: INormalizedBlog }) {
  return (
    <div className={styles.categoriesContainer}>
      <div>Categories:</div>

      <div className={styles.categories}>
        {blog.categories.map((cat) => (
          <Link
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

function BlogInfor({ blog }: { blog: INormalizedBlog }) {
  return (
    <div className={styles.container}>
      <div className="smTxt">
        <p>{blog?.authors.join(", ")}</p>
        <p>{formatDate(blog?.pub_date || "")}</p>
      </div>

      <h1 className={styles.title}>{blog?.title}</h1>

      <BlogContent blog={blog} />

      <Categories blog={blog} />
    </div>
  );
}

export default BlogInfor;
