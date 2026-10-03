/** @format */

import { useMutation } from "@tanstack/react-query";
import { publishBlog } from "../../api/blog.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function useBlogPublish() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: publishBlog,

    onSuccess: (response) => {
      // show toast message
      toast.success("Blog published");

      // redirect to blog page after success
      navigate(`/blog/${response.slug}`);
    },
  });
}

export default useBlogPublish;
