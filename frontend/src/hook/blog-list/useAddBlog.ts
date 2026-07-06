/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBlogToList } from "../../api/blog-list.api";
import { BlogListActionInput } from "../../types/blog-list.type";

function useAddBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, blogId }: BlogListActionInput) => {
      return await addBlogToList(listId, blogId);
    },
    onSuccess: (_data, variables) => {
      const { blogId, listId } = variables;

      queryClient.invalidateQueries({ queryKey: ["blog-list", blogId] });

      // in the LIST detail page
      queryClient.invalidateQueries({ queryKey: [["list-detail", listId]] });
    },
  });
}

export default useAddBlog;
