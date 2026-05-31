/** @format */

import { useParams } from "react-router-dom";
import BlogInfor from "../component/blog1/BlogInfor";
import BlogCmt from "../component/comment/BlogCmt";
import { useQuery } from "@tanstack/react-query";
import { getBLog } from "../api/blog.api";
import NotFound from "../component/NotFound";
import Loader from "../component/Loader";
import normalizeBlog from "../utils/normalize-heading";
import { BlogDetailProps } from "../types/blog.type";
import { AxiosError } from "axios";
import styles from "../styles/page/BlogDetail.module.scss";

function BlogDetail() {
  const { slug = "" } = useParams();
  const { data, isPending, error } = useQuery<BlogDetailProps, AxiosError>({
    queryKey: ["blog", slug],
    queryFn: () => getBLog(slug),
  });

  if (error?.response?.status === 404 || (!data && !isPending))
    return <NotFound message="Blog not found" />;

  if (isPending) return <Loader />;

  const blog = normalizeBlog(data);

  return (
    <div className={styles.container}>
      <BlogInfor blog={blog} />

      {/* commnent */}
      <BlogCmt blogId={blog._id} totalCmts={blog.totalCmts} />

      {/* recommened blog */}
    </div>
  );
}

export default BlogDetail;
