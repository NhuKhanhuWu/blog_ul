/** @format */

import { useMutation } from "@tanstack/react-query";
import { editCmt } from "../../api/comment.api";
import { useCmtItem } from "../../context/CmtItemContext";

function useEditCmt() {
  // edit the cmt content state
  const { dispatch } = useCmtItem();

  return useMutation({
    mutationFn: editCmt,
    onSuccess: (_response, input) => {
      dispatch({ type: "SET_CMT_CONTENT", payload: input.content });
    },
  });
}

export default useEditCmt;
