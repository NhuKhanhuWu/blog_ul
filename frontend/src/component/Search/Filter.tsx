/** @format */

import { ReactNode, useEffect, useMemo, useState } from "react";
import { ICategory } from "../../interface/category";
import styles from "../../styles/component/SearchBar.module.scss";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "./SearchBar";
import { useCategories } from "../../hook/useCategories";
import { useDebounce } from "../../hook/useDebounce";

interface ICategoryInput {
  category: ICategory;
  selectedIds: string[];
}

interface ICategories {
  categories: ICategory[];
  isPending: boolean;
  loadMoreBtn: ReactNode;
}

interface ILoadMoreBtn {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  fetchNextPage: () => void;
}

interface SelectedCatsProps {
  selectedIds: string[];
  allCategories: ICategory[];
  onRemove: (id: string) => void;
}

function Category({ category, selectedIds }: ICategoryInput) {
  const { setValue } = useFormContext<SearchFormValues>();
  const isChecked = selectedIds.includes(category._id);

  const handleChange = () => {
    if (isChecked) {
      // Nếu đang chọn thì bỏ chọn
      setValue(
        "categories",
        selectedIds.filter((id) => id !== category._id),
      );
    } else {
      // Nếu chưa chọn thì thêm vào
      setValue("categories", [...selectedIds, category._id]);
    }
  };

  return (
    <div className="checkbox">
      <input
        id={category._id}
        type="checkbox"
        value={category._id}
        // make sure checkbox always in right state when search
        checked={isChecked}
        onChange={handleChange}
      />
      <label htmlFor={category._id}>{category.name}</label>
    </div>
  );
}

function UnSelectedCats({ categories, loadMoreBtn }: ICategories) {
  const { watch } = useFormContext<SearchFormValues>();
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

      {loadMoreBtn}
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
  const { register } = useFormContext<SearchFormValues>();

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
  const { register } = useFormContext<SearchFormValues>();

  return (
    <div className={styles.filterOption}>
      <div className="checkbox">
        <input type="radio" value="and" id="and" {...register("logic")} />
        <label htmlFor="and">and</label>
      </div>

      <div className="checkbox">
        <input type="radio" value="or" id="or" {...register("logic")} />
        <label htmlFor="or">or</label>
      </div>

      <CategorySearch />
    </div>
  );
}

function LoadMoreBtn({
  isFetchingNextPage,
  hasNextPage,
  isError,
  fetchNextPage,
}: ILoadMoreBtn) {
  const cantLoadMore = isFetchingNextPage || !hasNextPage || !navigator.onLine;

  const handleClick = () => {
    if (!cantLoadMore) fetchNextPage();
  };

  return (
    <>
      <div
        className={`${styles.link} ${
          isFetchingNextPage && styles.disabled
        } ${styles.loadMoreBtn} link`}
        onClick={handleClick}>
        {isFetchingNextPage ? "Loading..." : "Load more"}
      </div>

      {isError && <p className={styles.errorMsg}>Something went wrong</p>}
    </>
  );
}

function Filter() {
  const { watch, setValue } = useFormContext<SearchFormValues>();

  // get data from form
  const categoryName = watch("categoryName");
  const selectedIds = watch("categories") || [];
  const debouncedCategoryName = useDebounce(categoryName, 500);

  // fetch categories from api
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useCategories(debouncedCategoryName);

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
        <span>Cat.: </span>
        <CategoriesOption />
      </div>

      {/* use allKnownCategories so chips won't disappear when search */}
      <SelectedCats
        selectedIds={selectedIds}
        allCategories={allKnownCategories}
        onRemove={handleRemove}
      />

      {/* display cats from api */}
      <UnSelectedCats
        loadMoreBtn={
          hasNextPage ? (
            <LoadMoreBtn
              isFetchingNextPage={isFetchingNextPage}
              isError={isFetchNextPageError}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
            />
          ) : null
        }
        categories={apiCategories}
        isPending={isPending || isFetchingNextPage}
      />
    </div>
  );
}

export default Filter;
