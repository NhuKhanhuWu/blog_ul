/** @format */

import { useMutation } from "@tanstack/react-query";
import { editExistingBlog } from "../../api/blog.api";

// turn pulished blog to draft blog
function useEditExistingBlog() {
  return useMutation({
    mutationFn: editExistingBlog,
  });
}

export default useEditExistingBlog;
