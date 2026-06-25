/** @format */

import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Cmt } from "../types/comment.type";
import {
  cmtItemReducer,
  CommentItemContextProps,
} from "../reducer/cmtItem.reducer";

const CommentItemContext = createContext<CommentItemContextProps | undefined>(
  undefined,
);

export const CommentItemProvider = ({
  initCmt,
  children,
}: {
  initCmt: Cmt;
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(cmtItemReducer, {
    cmt: initCmt,
    isEdit: false,
  });

  // Memoize value of context to avoild re-render
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <CommentItemContext.Provider value={value}>
      {children}
    </CommentItemContext.Provider>
  );
};

// Custom hook for child component
export const useCmtItem = () => {
  const context = useContext(CommentItemContext);
  if (!context) {
    throw new Error("useCommentItem must be placed inside CommentItemProvider");
  }
  return context;
};
