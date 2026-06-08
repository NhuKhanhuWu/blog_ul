/** @format */
import { useFormContext } from "react-hook-form";
import styles from "./Title.module.scss";
import { TSearchFormValues } from "../../../types/search.type";

export default function Title() {
  const { register } = useFormContext<TSearchFormValues>();

  return (
    <div className={styles.searchOption}>
      <input
        {...register("title")}
        className="input"
        type="text"
        placeholder="Search blogs..."></input>
    </div>
  );
}
