/** @format */

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { SearchFormValues } from "../interface/search";
import { useFormContext } from "react-hook-form";

type Logic = "or" | "and";
type Sort = "-upVotes" | "-pub_date" | "pub_date";

function isLogic(value: string): value is Logic {
  return ["or", "and"].includes(value);
}

function isSort(value: string): value is Sort {
  return ["-upVotes", "-pub_date", "pub_date"].includes(value);
}

function useSyncSearchForm() {
  // ---- synch url with state and form ----
  const { dispatch } = useSearch();
  const [searchParams] = useSearchParams();
  const { reset } = useFormContext<SearchFormValues>();

  const categories = searchParams.get("category") || "";
  const title = searchParams.get("title") || "";

  const rawSort = searchParams.get("sort") ?? "";
  const sort: Sort = isSort(rawSort) ? rawSort : "-upVotes";

  const rawLogic = searchParams.get("logic") ?? "";
  const logic: Logic = isLogic(rawLogic) ? rawLogic : "or";

  useEffect(() => {
    const categoryArray = categories ? categories.split(",") : [];

    // state
    dispatch({ type: "SET_CATEGORY", payload: categoryArray });
    dispatch({ type: "SET_TITLE", payload: title });
    dispatch({ type: "SET_LOGIC", payload: logic });
    dispatch({ type: "SET_SORT", payload: sort });

    // form
    reset({ title, sort, logic, categories: categoryArray });
  }, [categories, dispatch, logic, reset, sort, title]);
  // ---- synch url with state and form ----
}

export default useSyncSearchForm;
