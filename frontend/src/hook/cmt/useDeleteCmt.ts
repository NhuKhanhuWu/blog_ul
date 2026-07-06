/** @format */

import { useMutation } from "@tanstack/react-query";
import { deleteCmt } from "../../api/comment.api";
import { useCmtItem } from "../../context/CmtItemContext";

function useDeleteCmt() {
  const { dispatch } = useCmtItem();

  return useMutation({
    mutationFn: deleteCmt,

    onSuccess: () => {
      dispatch({ type: "DELETE_CMT" });
    },
  });
}

export default useDeleteCmt;
