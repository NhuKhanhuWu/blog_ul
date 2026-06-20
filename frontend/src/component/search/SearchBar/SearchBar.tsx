/** @format */
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearch } from "../../../context/SearchContext";
import styles from "./SearchBar.module.scss";
import Title from "../Title/Title";
import Sort from "../Sort/Sort";
import Categories from "../Categories/Categories";
import useSyncSearchForm from "../../../hook/search/useSyncSearchForm";
import { formSchema, TSearchFormValues } from "../../../types/search.type";
import { useSearchParams } from "react-router-dom";
import { updateSearchUrl } from "../../../utils/update-search-url";
import { Sheet } from "react-modal-sheet";
import { MdClose } from "react-icons/md";
import { useMediaQuery } from "react-responsive";

interface ISearchForm {
  onClose?: () => void;
}

function SubmitClearBtns() {
  const { reset } = useFormContext<TSearchFormValues>();
  const initValue = formSchema.getDefault();
  const { dispatch } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();

  function resetForm() {
    // reset form
    reset(initValue);

    // reset search state
    dispatch({ type: "RESET" });

    // update url
    updateSearchUrl({ searchParams, setSearchParams, data: initValue });
  }

  return (
    <div className={styles.searchFormActions}>
      <button type="submit" className="btn-primary">
        Search
      </button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => resetForm()}>
        Reset
      </button>
    </div>
  );
}

function SearchForm({ onClose }: ISearchForm) {
  const { dispatch } = useSearch();
  const { handleSubmit } = useFormContext<TSearchFormValues>();
  const [searchParams, setSearchParams] = useSearchParams();

  const onSubmit = (data: TSearchFormValues) => {
    dispatch({
      type: "SET_SEARCH",
      payload: {
        title: data.title,
        sort: data.sort,
        logic: data.logic,
        categories: data.categories,
        categoryName: data.categoryName,
      },
    });

    // update the url
    updateSearchUrl({ searchParams, setSearchParams, data });

    onClose?.();
  };

  // ---- synch url with state and form ----
  useSyncSearchForm();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.searchForm}>
        <div className={styles.formFieldsContainer}>
          <Title />
          <Sort />
          <Categories />
        </div>

        <div className={styles.formBtns}>
          <SubmitClearBtns />
        </div>
      </form>
    </>
  );
}

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { state } = useSearch();
  const methods = useForm<TSearchFormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: state,
    shouldUnregister: false,
  });
  const isDesktop = useMediaQuery({ query: "(min-width:1024px)" });

  return (
    <FormProvider {...methods}>
      {/* header */}

      {/* Mobile Toggle */}
      <button
        className={styles.searchMobileToggle}
        onClick={() => setIsOpen(true)}>
        <IoSearchSharp />
      </button>

      {/* Mobile Modal */}
      {!isDesktop && (
        <Sheet
          className={`${!isOpen && "hidden"}`}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}>
          <Sheet.Container>
            <Sheet.Header>
              <div className={styles.header}>
                <p className={styles.headerTitle}>Filter Blogs</p>
                <MdClose onClick={() => setIsOpen(false)} />
              </div>
            </Sheet.Header>

            <Sheet.Content>
              <div className={styles.searchMobile}>
                <SearchForm onClose={() => setIsOpen(false)} />
              </div>
            </Sheet.Content>
          </Sheet.Container>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {isDesktop && (
        <aside
          className={`${styles.searchDesktop} ${
            isCollapsed ? styles.collapsed : ""
          }`}>
          {isCollapsed ? (
            <button
              className={`${styles.collapseBtn} ${styles.icon}`}
              onClick={() => setIsCollapsed(false)}>
              <IoSearchSharp />
            </button>
          ) : (
            /* Show the full panel contents ONLY when the sidebar is expanded */
            <>
              <div className={styles.header}>
                <p className={styles.headerTitle}>Filter Blogs</p>
                {/* Clicking this sets isCollapsed to true */}
                <MdClose
                  onClick={() => setIsCollapsed(true)}
                  className={styles.icon}
                />
              </div>

              <div className={styles.searchFormWrapper}>
                <SearchForm />
              </div>
            </>
          )}
        </aside>
      )}
    </FormProvider>
  );
}

export default SearchBar;
