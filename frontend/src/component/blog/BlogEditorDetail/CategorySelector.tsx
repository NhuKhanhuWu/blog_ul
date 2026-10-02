/** @format */

import { useCategorySelector } from "../../../hook/category/useCategorySelector";
import { ICategory } from "../../../types/category.type";
import SelectedCategories from "../../category/SelectedCategories";
import styles from "./BlogEditorDetail.module.scss";

interface CategorySelectorProps {
  selectedCategories: ICategory[];
  onChange: (categories: ICategory[]) => void;
  maxSelected?: number;
}

function CategorySelector({
  selectedCategories,
  onChange,
  maxSelected = 50,
}: CategorySelectorProps) {
  const selectedIds = selectedCategories.map((category) => category._id);
  const {
    search,
    setSearch,
    categories,
    select,
    remove,
    canSelectMore,
    isPending,
    isFetchingNextPage,
    lastElementRef,
  } = useCategorySelector({
    selectedIds,
    maxSelected,
  });

  const handleToggle = (category: ICategory) => {
    const isSelected = selectedIds.includes(category._id);

    // Remove
    if (isSelected) {
      remove(category._id);

      onChange(selectedCategories.filter((item) => item._id !== category._id));

      return;
    }

    // Select
    if (!canSelectMore) return;

    const newIds = select(category);

    if (!newIds) return;

    onChange([...selectedCategories, category]);
  };

  const handleRemove = (id: string) => {
    remove(id);

    onChange(selectedCategories.filter((category) => category._id !== id));
  };

  return (
    <div>
      <SelectedCategories
        categories={selectedCategories}
        onRemove={handleRemove}
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search categories..."
        className="input"
      />

      <div className={styles.categories}>
        {categories.map((category) => {
          const selected = selectedIds.includes(category._id);

          return (
            <div className="checkbox" key={category._id}>
              <input
                id={category._id}
                type="checkbox"
                value={category._id}
                checked={selected}
                onChange={() => handleToggle(category)}
              />

              <label htmlFor={category._id}>{category.name}</label>
            </div>
          );
        })}

        <div ref={lastElementRef} />

        {(isPending || isFetchingNextPage) && <span>Loading...</span>}
      </div>

      {selectedIds.length >= maxSelected && (
        <p className="error-mgs">
          You can only select up to {maxSelected} categories.
        </p>
      )}
    </div>
  );
}

export default CategorySelector;
