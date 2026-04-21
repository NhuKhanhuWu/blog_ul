/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVote } from "../api/vote.api";
import { IToggleVote, IVoteResponse } from "../types/vote.type";
import { CmtCache } from "../types/comment.type";

type CmtQueryKey = ["cmt", ...unknown[]];

type MutationContext = {
  previousEntries: [CmtQueryKey, CmtCache | undefined][];
};

export function useToggleVote() {
  const queryClient = useQueryClient();

  return useMutation<IVoteResponse, Error, IToggleVote, MutationContext>({
    mutationFn: toggleVote,

    onMutate: async ({ targetId, voteType }): Promise<MutationContext> => {
      // find query cache have prefix ["cmt"]
      const queryKey = ["cmt"];
      // cancel query to avoid ovewrite data after update
      await queryClient.cancelQueries({ queryKey, exact: false });

      const previousEntries = queryClient.getQueriesData({
        queryKey,
        exact: false,
      }) as [CmtQueryKey, CmtCache | undefined][];

      // update cache page have targerId
      queryClient.setQueriesData<CmtCache>(
        { queryKey, exact: false },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((cmt) => {
                if (cmt._id !== targetId) return cmt;
                const prevVoteType = cmt.voteType ?? 0;
                const isSameVote = prevVoteType === voteType;
                const newVoteType = isSameVote ? 0 : voteType;

                return {
                  ...cmt,
                  voteType: newVoteType,
                  upVotes: calcVotes(cmt.upVotes, 1, prevVoteType, newVoteType),
                  downVotes: calcVotes(
                    cmt.downVotes,
                    -1,
                    prevVoteType,
                    newVoteType,
                  ),
                };
              }),
            })),
          };
        },
      );

      return { previousEntries };
    },

    onError: (_err, _vars, context) => {
      // Rollback tất cả entries về snapshot
      context?.previousEntries?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSuccess: (serverData, { targetId }) => {
      queryClient.setQueriesData<CmtCache>(
        { queryKey: ["cmt"], exact: false },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((cmt) =>
                cmt._id === targetId ? { ...cmt, ...serverData } : cmt,
              ),
            })),
          };
        },
      );
    },
  });
}

function calcVotes(
  current: number,
  forType: 1 | -1,
  prevVoteType: number,
  newVoteType: number,
): number {
  const wasActive = prevVoteType === forType;
  const isNowActive = newVoteType === forType;
  if (wasActive && !isNowActive) return current - 1; // tắt vote
  if (!wasActive && isNowActive) return current + 1; // bật vote
  return current;
}
