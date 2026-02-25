/** @format */
import { useFormContext } from "react-hook-form";
import styles from "../../styles/component/SearchBar.module.scss";
import { SearchFormValues } from "../../interface/search";

export default function Title() {
  const { register } = useFormContext<SearchFormValues>();

  return (
    <div className={styles.searchOption}>
      <span>Title:</span>
      <input
        {...register("title")}
        className="input"
        type="text"
        placeholder="Search..."></input>
    </div>
  );
}
