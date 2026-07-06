/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeBlogFromList } from "../../api/blog-list.api";
import { BlogListActionInput } from "../../types/blog-list.type";

function useRemoveBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, blogId }: BlogListActionInput) => {
      return await removeBlogFromList(listId, blogId);
    },
    onSuccess: (_data, variables) => {
      const { listId, blogId } = variables;

      // BLOG details
      queryClient.invalidateQueries({
        queryKey: ["blog-list", blogId],
      });

      // LIST detail
      queryClient.invalidateQueries({
        queryKey: ["list-detail", listId],
      });
    },
  });
}

export default useRemoveBlog;
