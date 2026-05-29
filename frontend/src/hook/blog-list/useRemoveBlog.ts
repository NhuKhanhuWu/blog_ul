/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeBlogFromList } from "../../api/blog-list.api";
import { BlogListActionInput } from "../../types/blog-list.type";

function useRemoveBlog(blogId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, blogId }: BlogListActionInput) => {
      return await removeBlogFromList(listId, blogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-list", blogId] });
    },
  });
}

export default useRemoveBlog;
