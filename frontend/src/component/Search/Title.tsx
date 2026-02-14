/** @format */
import { useFormContext } from "react-hook-form";
import "../../styles/component/Search.scss";
import { SearchFormValues } from "./Search";

export default function Title() {
  const { register } = useFormContext<SearchFormValues>();

  return (
    <div className="search-option">
      <span>Title:</span>
      <div className="search-title">
        <input
          {...register("title")}
          className="input"
          type="text"
          placeholder="Search..."></input>
      </div>
    </div>
  );
}
