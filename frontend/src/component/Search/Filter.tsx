/** @format */

import { ReactNode, useEffect, useRef } from "react";
import { ICategory } from "../../interface/category";
import "../../styles/component/Search.scss";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "./Search";
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
        {...register("categories")}></input>
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
        block: "start",
      });
    }
  }, [categories.length, isPending]);

  return (
    <div className="categories">
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
    <div className="search-title" style={{ width: "175px" }}>
      <input
        className="input"
        type="text"
        placeholder="Search..."
        {...register("categoryName")}></input>
    </div>
  );
}

function CategoriesOption() {
  const { register } = useFormContext<SearchFormValues>();

  return (
    <div className="filter-option">
      {/* filter logic */}
      <div className="checkbox">
        <input type="radio" value="and" id="and" {...register("logic")}></input>
        <label htmlFor="and">and</label>
      </div>

      <div className="checkbox">
        <input type="radio" value="or" id="or" {...register("logic")}></input>
        <label htmlFor="or">or</label>
      </div>

      {/* category search */}
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
        className={`link ${isFetchingNextPage && "disabled"} load-more`}
        onClick={() => handleClick()}>
        {isFetchingNextPage ? "Loading..." : "Load more"}
      </div>

      {isError && <p className="error-mgs">Something went wrong</p>}
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
      <div className="search-option ">
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
