/** @format */

import { useParams } from "react-router-dom";
import BlogInfor from "../component/Blog/BlogInfor";
import BlogCmt from "../component/cmt/BlogCmt";
import { useQuery } from "@tanstack/react-query";
import { getBLog } from "../api/blog/getBlog";
import NotFound from "../component/NotFound";
import Loader from "../component/Loader";
import normalizeBlog from "../utils/normalizeHeading";
import { IBlogDetail } from "../interface/blog";
import { AxiosError } from "axios";
import styles from "../styles/page/BlogDetail.module.scss";

function BlogDetail() {
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
      <BlogInfor blog={blog} />

      {/* commnent */}
      <BlogCmt blogId={blog._id} />

      {/* recommened blog */}
    </div>
  );
}

export default BlogDetail;
