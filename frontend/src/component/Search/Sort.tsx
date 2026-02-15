/** @format */

import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "./Search";

function Sort() {
  const { register } = useFormContext<SearchFormValues>();

  return (
    <div className="search-option">
      <span>Sort by:</span>

      <select
        className="flex-1"
        style={{ width: "235px" }}
        {...register("sort")}>
        <option value="-pub_date">Newest</option>
        <option value="-voteScore">Popular</option>
        <option value="pub_date">Oldest</option>
      </select>
    </div>
  );
}

export default Sort;
