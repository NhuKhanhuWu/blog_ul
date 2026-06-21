/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createList } from "../../api/blog-list.api";
import { CreateListProps } from "../../types/blog-list.type";

function useCreateList(blogId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listData: CreateListProps) => {
      return await createList(listData);
    },
    onSuccess: () => {
      const queryKey = ["blog-list"];

      if (blogId) queryKey.push(blogId);

      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  });
}

export default useCreateList;
