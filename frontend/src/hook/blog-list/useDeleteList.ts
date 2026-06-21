/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlogList } from "../../api/blog-list.api";
import { useLocation, useNavigate } from "react-router-dom";

function useDeleteList() {
  const queryClient = useQueryClient();

  // reload page when in blog list detail
  const location = useLocation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteBlogList,
    onSuccess: () => {
      // when query multiple lists
      queryClient.invalidateQueries({ queryKey: ["blog-list"] });

      // reload
      if (location.pathname.includes("/list/")) navigate(0);
    },
  });
}

export default useDeleteList;
