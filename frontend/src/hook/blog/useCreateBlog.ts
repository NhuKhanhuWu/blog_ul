/** @format */

import { useMutation } from "@tanstack/react-query";
import { createBlog } from "../../api/blog.api";
import { useNavigate } from "react-router-dom";

function useCreateBlog() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createBlog,

    onSuccess: (response) => {
      // navigate to the edit page
      navigate(`/blog/edit/${response._id}`);
    },
  });
}

export default useCreateBlog;
