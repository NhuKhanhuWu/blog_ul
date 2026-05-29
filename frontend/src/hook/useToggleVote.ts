/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVote } from "../api/vote.api";
import { IToggleVote, IVoteResponse } from "../types/vote.type";
import { CmtCache } from "../types/comment.type";
import { BlogDetailProps } from "../types/blog.type";

type CmtQueryKey = ["cmt", ...unknown[]];

type MutationContext = {
  previousEntries: [CmtQueryKey, CmtCache | undefined][];
};

export function useToggleCmtVote() {
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
            pages: oldData.pages.map((page) => {
              // check if this page has target cmt
              const hasTarget = page.data.some((cmt) => cmt._id === targetId);

              // if not => return old data
              if (!hasTarget) return page;

              return {
                ...page,
                data: page.data.map((cmt) => {
                  if (cmt._id !== targetId) return cmt;
                  const prevVoteType = cmt.voteType ?? 0;
                  const isSameVote = prevVoteType === voteType;
                  const newVoteType = isSameVote ? 0 : voteType;

                  return {
                    ...cmt,
                    voteType: newVoteType,
                    upVotes: calcVotes(
                      cmt.upVotes,
                      1,
                      prevVoteType,
                      newVoteType,
                    ),
                    downVotes: calcVotes(
                      cmt.downVotes,
                      -1,
                      prevVoteType,
                      newVoteType,
                    ),
                  };
                }),
              };
            }),
          };
        },
      );

      return { previousEntries };
    },

    onError: (_err, _vars, context) => {
      // Rollback all entries to snapshot
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
            pages: old.pages.map((page) => {
              // check if this page has target cmt
              const hasTarget = page.data.some((cmt) => cmt._id === targetId);

              // if not => return old data
              if (!hasTarget) return page;

              return {
                ...page,
                data: page.data.map((cmt) =>
                  cmt._id === targetId ? { ...cmt, ...serverData } : cmt,
                ),
              };
            }),
          };
        },
      );
    },
  });
}

export function useToggleBlogVote(slug: string) {
  const queryClient = useQueryClient();
  const queryKey = ["blog", slug];

  return useMutation({
    mutationFn: toggleVote,

    onMutate: async (newVote) => {
      // Cancel current query to avoid overwrite
      await queryClient.cancelQueries({ queryKey });

      // save snapshot to rollback
      const previousBlog = queryClient.getQueryData<BlogDetailProps>(queryKey);

      // update optimistic data
      if (previousBlog) {
        queryClient.setQueryData<BlogDetailProps>(queryKey, {
          ...previousBlog,
          // calculate votes
          upVotes: calcVotes(
            previousBlog.upVotes,
            1,
            previousBlog.voteType,
            newVote.voteType,
          ),
          downVotes: calcVotes(
            previousBlog.downVotes,
            -1,
            previousBlog.voteType,
            newVote.voteType,
          ),
          // update use vote type
          voteType: newVote.voteType,
        });
      }

      // return old data
      return { previousBlog };
    },

    // if error -> Rollback
    onError: (err, _, context) => {
      if (context?.previousBlog) {
        queryClient.setQueryData(queryKey, context.previousBlog);
      }

      console.error("Vote failed:", err);
    },

    // refresh to match with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
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
