/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateList } from "../../api/blog-list.api";

function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateList,

    onSuccess: (response) => {
      // update in the multiple lists query
      queryClient.invalidateQueries({
        queryKey: ["blog-list", response.userId],
        exact: true,
      });

      // update in the list detail page
      queryClient.invalidateQueries({
        queryKey: ["blog-list-infor", response._id],
        exact: true,
      });
    },
  });
}

export default useUpdateList;
