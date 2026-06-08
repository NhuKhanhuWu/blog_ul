/** @format */

import { useFormContext } from "react-hook-form";
import { TSearchFormValues } from "../../../types/search.type";
import styles from "./Sort.module.scss";

function Sort() {
  const { register } = useFormContext<TSearchFormValues>();

  return (
    <div className={styles.searchOption}>
      <p>Sort by</p>

      <select className="flex-1" {...register("sort")}>
        <option value="-upVotes">Popular</option>
        <option value="-pub_date">Newest</option>
        <option value="pub_date">Oldest</option>
      </select>
    </div>
  );
}

export default Sort;
