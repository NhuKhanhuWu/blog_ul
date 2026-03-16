/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVote } from "../api/vote"; // Import hàm axios của bạn
import { IToggleVote, IVoteResponse } from "../interface/voteTypes";

export function useToggleVote() {
  const queryClient = useQueryClient();

  return useMutation<IVoteResponse, Error, IToggleVote>({
    mutationFn: toggleVote,
    onSettled: (_data, _error, { targetId, targetType }) => {
      queryClient.invalidateQueries({
        queryKey: [targetType === "comment" ? "cmt" : "blog", targetId],
      });
    },
  });
}
