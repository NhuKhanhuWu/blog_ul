/** @format */

import { ReactNode, useEffect, useRef } from "react";
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

function Category({ category }: ICategoryInput) {
  const { register } = useFormContext<SearchFormValues>();

  return (
    <div className="checkbox">
      <input
        id={category._id}
        type="checkbox"
        value={category._id}
        {...register("categories")}
      />
      <label htmlFor={category._id}>{category.name}</label>
    </div>
  );
}

function Categories({ categories, isPending, loadMoreBtn }: ICategories) {
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isPending && lastItemRef.current) {
      lastItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [categories.length, isPending]);

  return (
    <div className={styles.categories}>
      {categories.map((item, index) => {
        const isLast = index === categories.length - 1;

        return (
          <div key={item._id} ref={isLast ? lastItemRef : null}>
            <Category category={item} />
          </div>
        );
      })}

      {loadMoreBtn}
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
  const { watch } = useFormContext<SearchFormValues>();
  const categoryName = watch("categoryName");
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

  return (
    <div>
      <div className={styles.searchOption}>
        <span>Cat.: </span>
        <CategoriesOption />
      </div>

      <Categories
        loadMoreBtn={
          hasNextPage ? (
            <LoadMoreBtn
              isFetchingNextPage={isFetchingNextPage}
              isError={isFetchNextPageError}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
            />
          ) : (
            ""
          )
        }
        categories={categories}
        isPending={isPending || isFetchingNextPage}
      />
    </div>
  );
}

export default Filter;
