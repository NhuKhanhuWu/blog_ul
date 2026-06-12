/** @format */

import { useParams } from "react-router-dom";

import { AxiosError } from "axios";
import styles from "./BlogDetail.module.scss";
import { useQuery } from "@tanstack/react-query";
import { BlogDetailProps } from "../../types/blog.type";
import { getBLog } from "../../api/blog.api";
import NotFound from "../../component/ui/NotFound/NotFound";
import Loader from "../../component/ui/Loader/Loader";
import normalizeBlog from "../../utils/normalize-heading";
import BlogInfor from "../../component/blog/BlogInfor/BlogInfor";
import BlogCmt from "../../component/comment/BlogCmt/BlogCmt";
import RecommendedBlogs from "../../component/blog/RecommendedBlogs/RecommendedBlogs";

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
  // TODO: update ui of this page
  return (
    <div className={styles.container}>
      <div className={styles.blogSection}>
        <BlogInfor blog={blog} />
        <BlogCmt blogId={blog._id} totalCmts={blog.totalCmts} />
      </div>

      <RecommendedBlogs curBlog={blog} />
    </div>
  );
}

export default BlogDetail;
