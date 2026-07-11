/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CmtCache } from "../../types/comment.type";
import { BlogDetailProps } from "../../types/blog.type";
import { createCmt } from "../../api/comment.api";

export function useCreateCmt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCmt,

    onSuccess: (newCmt) => {
      const parentIdStr = newCmt.parentId ? newCmt.parentId.toString() : null;

      const cmtQueryKey = newCmt.parentId
        ? ["cmt-replies", parentIdStr] // if this is child cmt
        : ["cmt"]; // if this is parent cmt

      // update cmt list
      queryClient.setQueriesData<CmtCache>(
        { queryKey: cmtQueryKey, exact: false },
        (oldData) => {
          if (!oldData) return oldData;
          // return new cmt list
          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index !== 0) return page;
              return {
                ...page,
                data: [newCmt, ...page.data], // new cmt on top
              };
            }),
          };
        },
      );

      // update cmt's total replies
      if (newCmt.parentId) {
        queryClient.setQueriesData<CmtCache>(
          { queryKey: ["cmt"], exact: false },
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((cmt) =>
                  cmt._id.toString() === parentIdStr
                    ? { ...cmt, replyCount: cmt.replyCount + 1 }
                    : cmt,
                ),
              })),
            };
          },
        );
      }

      // update blog's total cmt
      queryClient.setQueriesData<BlogDetailProps>(
        { queryKey: ["blog"], exact: false },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            totalCmts: oldData.totalCmts + 1,
          };
        },
      );
    },
  });
}
