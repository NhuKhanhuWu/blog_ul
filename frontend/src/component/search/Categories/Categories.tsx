/** @format */

import { ReactNode, useEffect, useMemo, useState } from "react";
import { ICategory } from "../../../types/category.type";
import styles from "./Categories.module.scss";
import { useFormContext } from "react-hook-form";
import { TSearchFormValues } from "../../../types/search.type";
import { useCategories } from "../../../hook/search/useCategories";
import { useDebounce } from "../../../hook/useDebounce";
import { Category } from "../Category/Category";
import { useIntersectionObserver } from "../../../hook/useIntersectionObserver";
import InfinityObserver from "../../ui/InfinityObserver/InfinityObserver";
import Loader from "../../ui/Loader/Loader";

interface ICategories {
  categories: ICategory[];
  isPending: boolean;
  infinityObserver: ReactNode;
}

interface SelectedCatsProps {
  selectedIds: string[];
  allCategories: ICategory[];
  onRemove: (id: string) => void;
}

function UnSelectedCats({ categories, infinityObserver }: ICategories) {
  const { watch } = useFormContext<TSearchFormValues>();
  const selectedIds = watch("categories") || [];

  return (
    <div className={styles.categories}>
      {categories.map((item) => {
        return (
          <div key={item._id}>
            <Category selectedIds={selectedIds} category={item} />
          </div>
        );
      })}

      {infinityObserver}
    </div>
  );
}

function SelectedCats({
  selectedIds,
  allCategories,
  onRemove,
}: SelectedCatsProps) {
  const selectedCategories = useMemo(() => {
    const map = new Map(allCategories.map((c) => [c._id, c]));
    return selectedIds.map((id) => map.get(id)).filter(Boolean) as ICategory[];
  }, [selectedIds, allCategories]);

  if (selectedCategories.length === 0) return null;

  return (
    <div className={styles.chips}>
      {selectedCategories.map((cat) => (
        <div key={cat._id} className={styles.chip}>
          <span>{cat.name}</span>
          <button
            type="button"
            onClick={() => onRemove(cat._id)}
            className={styles.removeBtn}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function CategorySearch() {
  const { register } = useFormContext<TSearchFormValues>();

  return (
    <input
      className={`${styles.categoryInput} input`}
      type="text"
      placeholder="Search..."
      {...register("categoryName")}
    />
  );
}

function CategoriesOption() {
  const { register } = useFormContext<TSearchFormValues>();

  return (
    <div className={styles.filterOption}>
      <select {...register("logic")} id="logic">
        <option value="or">or</option>
        <option value="and">and</option>
      </select>
      <CategorySearch />
    </div>
  );
}

function Categories() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TSearchFormValues>();

  // get data from form
  const categoryName = watch("categoryName");
  const selectedIds = watch("categories") || [];
  const debouncedCategoryName = useDebounce(categoryName, 500);

  // fetch categories from api
  const { data, fetchNextPage, hasNextPage, isPending, isFetchingNextPage } =
    useCategories(debouncedCategoryName);
  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  );

  // flat categories, cache with useMemo to reduce re-render
  const apiCategories = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data?.pages],
  );

  // store selected cats to a state
  // helps show chips when search for other categories
  const [cachedSelectedCats, setCachedSelectedCats] = useState<ICategory[]>([]);

  // once selectedId or cats from API changes
  useEffect(() => {
    // find cat checked in form but not cached yet
    const selectedSet = new Set(selectedIds);
    const cachedSet = new Set(cachedSelectedCats.map((c) => c._id));
    const newlySelected = apiCategories.filter(
      (cat) =>
        selectedSet.has(cat._id) && // cats that are selected in the form
        !cachedSet.has(cat._id), // but not cached yet
    );

    // update only when needed => avoid infinity re-render
    if (newlySelected.length > 0) {
      setCachedSelectedCats((prev) => [...prev, ...newlySelected]);
    }
  }, [selectedIds, apiCategories, cachedSelectedCats]);

  // merger cats = cats in cache + cat in API.
  const allKnownCategories = useMemo(() => {
    const map = new Map<string, ICategory>(); // use map to avoid overlap

    cachedSelectedCats.forEach((c) => map.set(c._id, c)); //
    apiCategories.forEach((c) => map.set(c._id, c));

    return Array.from(map.values());
  }, [cachedSelectedCats, apiCategories]);

  const handleRemove = (id: string) => {
    // 1. update values inform
    const updatedIds = selectedIds.filter((cid) => cid !== id);
    setValue("categories", updatedIds);

    // 2. update select cats in cache
    setCachedSelectedCats((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div>
      <div className={styles.searchOption}>
        <label htmlFor="logic">Categories </label>
        <CategoriesOption />
      </div>

      {errors.categories && (
        <p className="error-mgs">{errors.categories.message}</p>
      )}

      {/* use allKnownCategories so chips won't disappear when search */}
      <SelectedCats
        selectedIds={selectedIds}
        allCategories={allKnownCategories}
        onRemove={handleRemove}
      />

      {/* display cats from api */}
      <UnSelectedCats
        categories={apiCategories}
        isPending={isPending || isFetchingNextPage}
        infinityObserver={
          <InfinityObserver lastElementRef={lastElementRef}>
            {(isPending || isFetchingNextPage) && <Loader />}
          </InfinityObserver>
        }
      />
    </div>
  );
}

export default Categories;
