/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCmt } from "../../api/cmt/createCmt";
import { CmtCache } from "../../interface/cmtTypes";

export function useCreateCmt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCmt,

    onSuccess: (newCmt) => {
      // TODO: update blog total cmt, cmt's total replies

      const queryKey = newCmt.parentId
        ? ["cmt-replies", newCmt.parentId] // if this is child cmt
        : ["cmt"]; // if this is parent cmt

      // if this is parent cmt
      queryClient.setQueriesData<CmtCache>(
        { queryKey, exact: false },
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
    },
  });
}
