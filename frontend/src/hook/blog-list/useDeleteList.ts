/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlogList } from "../../api/blog-list.api";

function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-list"] });
    },
  });
}

export default useDeleteList;
