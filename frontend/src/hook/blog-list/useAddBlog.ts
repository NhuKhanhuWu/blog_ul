/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBlogToList } from "../../api/blog-list.api";
import { BlogListActionInput } from "../../types/blog-list.type";

function useAddBlog(blogId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, blogId }: BlogListActionInput) => {
      return await addBlogToList(listId, blogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-list", blogId] });
    },
  });
}

export default useAddBlog;
