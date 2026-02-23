/** @format */

import { useQuery } from "@tanstack/react-query";
import { getBLog } from "../api/blog/getBlog";
import { useParams } from "react-router-dom";
import {
  IBlogDetail,
  INormalizedBlog,
  NormalizedContent,
} from "../interface/blog";
import { AxiosError } from "axios";
import NotFound from "../component/NotFound";
import Loader from "../component/Loader";
import formatDate from "../utils/fomatDate";
import styles from "../styles/component/BlogDetail.module.scss";
import normalizeBlog from "../utils/normalizeHeading";

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

function BlogDetailMobile() {
  const { slug = "" } = useParams();
  const { data, isPending, error } = useQuery<IBlogDetail, AxiosError>({
    queryKey: ["blog", slug],
    queryFn: () => getBLog(slug),
  });

  if (error?.response?.status === 404 || !data)
    return <NotFound message="Blog not found" />;

  if (isPending) return <Loader />;

  const blog = normalizeBlog(data);

  return (
    <div className={styles.container}>
      <div className="smTxt">
        <p>{blog?.authors.join(", ")}</p>
        <p>{formatDate(blog?.pub_date || "")}</p>
      </div>

      <h1 className={styles.title}>{blog?.title}</h1>

      <BlogContent blog={blog} />

      <div className={styles.categories}></div>
    </div>
  );
}

export default BlogDetailMobile;
