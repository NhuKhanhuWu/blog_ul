/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlog } from "../../api/blog.api";
import toast from "react-hot-toast";

function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      const queryKey = ["my-blogs"];

      queryClient.invalidateQueries({
        queryKey: queryKey,
        exact: false,
      });

      // toast
      toast.success("Blog deleted");
    },
  });
}

export default useDeleteBlog;
