/** @format */

import { SetURLSearchParams } from "react-router-dom";
import { SearchFormValues } from "../interface/search";

export interface IUpdateSearchUrl {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  data: SearchFormValues;
}

export function updateSearchUrl({
  searchParams,
  setSearchParams,
  data,
}: IUpdateSearchUrl) {
  const param = new URLSearchParams(searchParams);
  const { title, sort, logic, categories } = data;

  if (title) param.set("title", title);
  if (sort) param.set("sort", sort);
  if (logic) param.set("logic", logic);
  if (categories) param.set("category", categories.join(","));

  setSearchParams(param);
}
