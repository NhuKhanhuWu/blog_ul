/** @format */

import { ICategory } from "../../types/category.type";
import styles from "./SelectedCategories.module.scss";

interface SelectedCategoriesProps {
  categories: ICategory[];
  onRemove: (id: string) => void;
}

function SelectedCategories({ categories, onRemove }: SelectedCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <div className={styles.chips}>
      {categories.map((category) => (
        <div key={category._id} className={styles.chip}>
          <span>{category.name}</span>

          <button
            type="button"
            onClick={() => onRemove(category._id)}
            className={styles.removeBtn}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default SelectedCategories;
