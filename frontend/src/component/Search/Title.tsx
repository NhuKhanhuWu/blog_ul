/** @format */
import { useFormContext } from "react-hook-form";
import styles from "../../styles/component/SearchBar.module.scss";
import { TSearchFormValues } from "../../interface/searchTypes";

export default function Title() {
  const { register } = useFormContext<TSearchFormValues>();

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
