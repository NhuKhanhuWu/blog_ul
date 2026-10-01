/** @format */

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getMyBlogById } from "../../api/blog.api";
import BlogEditor from "../../component/blog/BlogEditor/BlogEditor.tsx";
import Loader from "../../component/ui/Loader/Loader.tsx";

function EditBlog() {
  const { id: blogId } = useParams<{ id: string }>();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["edit-blog", blogId],
    queryFn: () => getMyBlogById(blogId!),
    enabled: !!blogId,
  });

  if (isLoading) {
    return (
      <div>
        Loading blog <Loader />
      </div>
    );
  }

  if (isError || !blog) {
    return <div className="error-msg">Unable to load this blog.</div>;
  }

  return <BlogEditor blog={blog} />;
}

export default EditBlog;
