/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlogList } from "../../api/blog-list.api";
import { BlogListData } from "../../types/blog-list.type";

function useUpdateList(blogList: BlogListData | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBlogList,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-blog-list", blogList?.userId],
      });
    },
  });
}

export default useUpdateList;
