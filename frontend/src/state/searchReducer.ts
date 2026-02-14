/** @format */

export interface SearchState {
  title: string;
  sort: "popular" | "newest" | "oldest";
  logic: "or" | "and";
  categories: string[];
}

export const initSearchState: SearchState = {
  title: "",
  sort: "newest",
  logic: "or",
  categories: [],
};

export type SearchAction =
  | { type: "SET_CATEGORY"; payload: string[] }
  | { type: "SET_LOGIC"; payload: "and" | "or" }
  | { type: "SET_SORT"; payload: "newest" | "oldest" | "popular" }
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_SEARCH"; payload: SearchState }
  | { type: "RESET" };

export function searchReducer(
  state: SearchState,
  action: SearchAction,
): SearchState {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, categories: action.payload };

    case "SET_LOGIC":
      return { ...state, logic: action.payload };

    case "SET_SORT":
      return { ...state, sort: action.payload };

    case "SET_TITLE":
      return { ...state, title: action.payload };

    case "SET_SEARCH":
      return { ...state, ...action.payload };

    case "RESET":
      return initSearchState;

    default:
      return state;
  }
}
