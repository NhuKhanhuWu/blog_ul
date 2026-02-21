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

function Category({ category }: ICategoryInput) {
  const { register, watch } = useFormContext<SearchFormValues>();
  const selectedIds = watch("categories") || [];

  return (
    <div className="checkbox">
      <input
        id={category._id}
        type="checkbox"
        value={category._id}
        // make sure checkbox always in right state when search
        checked={selectedIds.includes(category._id)}
        {...register("categories")}
      />
      <label htmlFor={category._id}>{category.name}</label>
    </div>
  );
}

function UnSelectedCats({ categories, loadMoreBtn }: ICategories) {
  return (
    <div className={styles.categories}>
      {categories.map((item) => {
        return (
          <div key={item._id}>
            <Category category={item} />
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
    <div className={styles.wrapper}>
      <span className={styles.label}>
        Selected ({selectedCategories.length})
      </span>

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

// function Filter() {
//   const { watch } = useFormContext<SearchFormValues>();
//   const categoryName = watch("categoryName");
//   const selectedIds = watch("categories") || [];
//   const debouncedCategoryName = useDebounce(categoryName, 500);

//   // State to store selected categories
//   // (Help show category event when API doesn't return it)
//   const [selectedCategories, setselectedCategories] = useState<ICategory[]>([]);

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isPending,
//     isFetchingNextPage,
//     isFetchNextPageError,
//   } = useCategories(debouncedCategoryName);

//   const apiCategories = data?.pages.flatMap((page) => page.data) || [];

//   // once apiCategories change, update selectedObjects list
//   useEffect(() => {
//     const newlySelected = apiCategories.filter(
//       (cat) =>
//         selectedIds.includes(cat._id) &&
//         !selectedCategories.find((obj) => obj._id === cat._id),
//     );
//     if (newlySelected.length > 0) {
//       setselectedCategories((prev) => [...prev, ...newlySelected]);
//     }
//   }, [apiCategories, selectedCategories, selectedIds]);

//   // display categories handler
//   const displayedCategories = useMemo(() => {
//     // 1. turn selectedIds to Set to optimize seaching
//     const selectedSet = new Set(selectedIds);

//     // 2. get categories
//     const currentlySelected = selectedCategories.filter((cat) =>
//       selectedSet.has(cat._id),
//     );

//     // 3. filter out selected categories from apiCategories
//     const filteredApiCategories = apiCategories.filter(
//       (apiCat) => !selectedSet.has(apiCat._id),
//     );

//     return [...currentlySelected, ...filteredApiCategories];
//   }, [apiCategories, selectedIds, selectedCategories]);

//   return (
//     <div>
//       <div className={styles.searchOption}>
//         <span>Cat.: </span>
//         <CategoriesOption />
//       </div>

//       <UnSelectedCats
//         loadMoreBtn={
//           hasNextPage ? (
//             <LoadMoreBtn
//               isFetchingNextPage={isFetchingNextPage}
//               isError={isFetchNextPageError}
//               fetchNextPage={fetchNextPage}
//               hasNextPage={hasNextPage}
//             />
//           ) : null
//         }
//         categories={displayedCategories}
//         isPending={isPending || isFetchingNextPage}
//       />
//     </div>
//   );
// }

function Filter() {
  const { watch, setValue } = useFormContext<SearchFormValues>();
  const categoryName = watch("categoryName");
  const selectedIds = watch("categories") || [];
  const debouncedCategoryName = useDebounce(categoryName, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useCategories(debouncedCategoryName);

  const categories = data?.pages.flatMap((page) => page.data) || [];

  const handleRemove = (id: string) => {
    setValue(
      "categories",
      selectedIds.filter((cid) => cid !== id),
    );
  };

  return (
    <div>
      <div className={styles.searchOption}>
        <span>Cat.: </span>
        <CategoriesOption />
      </div>
      <SelectedCats
        selectedIds={selectedIds}
        allCategories={categories}
        onRemove={handleRemove}
      />

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
        categories={categories}
        isPending={isPending || isFetchingNextPage}
      />
    </div>
  );
}

export default Filter;
