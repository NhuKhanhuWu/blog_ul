/** @format */

import { Dispatch } from "react";
import { Cmt } from "../types/comment.type";

export interface CmtItemState {
  cmt: Cmt | null;
  isEdit: boolean;
}

export interface CommentItemContextProps {
  state: CmtItemState;
  dispatch: Dispatch<CmtItemAction>;
}

export type CmtItemAction =
  | { type: "SET_IS_EDIT"; payload: boolean }
  | { type: "SET_CMT_CONTENT"; payload: string }
  | { type: "DELETE_CMT" };

export const initCmtItemState = (initialCmt: Cmt): CmtItemState => ({
  cmt: initialCmt,
  isEdit: false,
});

export function cmtItemReducer(
  state: CmtItemState,
  action: CmtItemAction,
): CmtItemState {
  switch (action.type) {
    case "SET_IS_EDIT":
      return { ...state, isEdit: action.payload };

    case "SET_CMT_CONTENT": {
      if (!state.cmt) return state;

      return { ...state, cmt: { ...state.cmt, content: action.payload } };
    }

    case "DELETE_CMT":
      return { ...state, cmt: null };

    default:
      return state;
  }
}
