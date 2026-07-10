/** @format */

import { SetURLSearchParams } from "react-router-dom";
import { TSearchFormValues } from "../types/search.type";

export interface IUpdateSearchUrl {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  data: TSearchFormValues;
}

export function updateSearchUrl({
  searchParams,
  setSearchParams,
  data,
}: IUpdateSearchUrl) {
  const param = new URLSearchParams(searchParams);
  const { title, sort, logic, categories } = data;
  console.log(typeof title);

  if (title && title.trim() !== "") {
    param.set("title", title);
  } else {
    param.delete("title");
  }

  if (sort) param.set("sort", sort);
  if (logic) param.set("logic", logic);
  if (categories) param.set("category", categories.join(","));

  setSearchParams(param);
}
