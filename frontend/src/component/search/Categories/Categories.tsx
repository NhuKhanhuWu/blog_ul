/** @format */

import { useEffect } from "react";
import styles from "./Categories.module.scss";
import { useFormContext } from "react-hook-form";
import { TSearchFormValues } from "../../../types/search.type";
import { Category } from "../Category/Category";
import InfinityObserver from "../../ui/InfinityObserver/InfinityObserver";
import Loader from "../../ui/Loader/Loader";
import { useCategorySelector } from "../../../hook/category/useCategorySelector";
import SelectedCategories from "../../category/SelectedCategories";

function Categories() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<TSearchFormValues>();

  const selectedIds = watch("categories") ?? [];
  const categoryName = watch("categoryName") ?? "";

  const {
    setSearch,
    categories,
    allKnownCategories,
    remove,
    isPending,
    isFetchingNextPage,
    lastElementRef,
  } = useCategorySelector({
    selectedIds,
    maxSelected: 50,
  });

  /*
   * Sync form search value -> category selector
   */
  useEffect(() => {
    setSearch(categoryName);
  }, [categoryName, setSearch]);

  const selectedCategories = allKnownCategories.filter((category) =>
    selectedIds.includes(category._id),
  );

  const handleRemove = (id: string) => {
    const updatedIds = remove(id);

    setValue("categories", updatedIds);
  };

  return (
    <div>
      <label>Categories</label>

      {errors.categories && (
        <p className="error-mgs">{errors.categories.message}</p>
      )}

      <SelectedCategories
        categories={selectedCategories}
        onRemove={handleRemove}
      />

      <input
        className={`${styles.categoryInput} input`}
        type="text"
        placeholder="Search..."
        {...register("categoryName")}
      />

      <div className={styles.categories}>
        {categories.map((category) => (
          <Category
            key={category._id}
            category={category}
            selectedIds={selectedIds}
          />
        ))}

        <InfinityObserver lastElementRef={lastElementRef}>
          {(isPending || isFetchingNextPage) && <Loader />}
        </InfinityObserver>
      </div>
    </div>
  );
}

export default Categories;
