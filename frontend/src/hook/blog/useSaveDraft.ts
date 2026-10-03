/** @format */

import { useMutation } from "@tanstack/react-query";
import { saveDraft } from "../../api/blog.api";

function useSaveDraft() {
  return useMutation({
    mutationFn: saveDraft,
  });
}

export default useSaveDraft;
