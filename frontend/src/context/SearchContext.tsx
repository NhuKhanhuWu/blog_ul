/** @format */

import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Dispatch,
} from "react";
import {
  initSearchState,
  searchReducer,
  SearchState,
  SearchAction,
} from "../state/searchReducer";

interface SearchContextType {
  state: SearchState;
  dispatch: Dispatch<SearchAction>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initSearchState);

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
}

/**
 * Custom Hook
 */
export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used inside SearchProvider");
  }

  return context;
}
