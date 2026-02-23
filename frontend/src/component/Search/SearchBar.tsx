/** @format */
import { ReactNode, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearch } from "../../context/SearchContext";
import Modal from "../Modal";
import Title from "./Title";
import Sort from "./Sort";
import Filter from "./Filter";
import styles from "../../styles/component/SearchBar.module.scss";
import useSyncSearchForm from "../../hook/useSyncSearchForm";
import { formSchema, SearchFormValues } from "../../interface/search";
import { useSearchParams } from "react-router-dom";
import { updateSearchUrl } from "../../utils/updateSearchUrl";

interface ISearchForm {
  onClose?: () => void;
  closeBtn?: ReactNode;
}

function SubmitClearBtns() {
  const { reset } = useFormContext<SearchFormValues>();
  const initValue = formSchema.getDefault();
  const { dispatch } = useSearch();

  function resetForm() {
    // reset form
    reset(initValue);

    // reset search state
    dispatch({ type: "RESET" });
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
        Clear
      </button>
    </div>
  );
}

function SearchForm({ onClose, closeBtn }: ISearchForm) {
  const { dispatch } = useSearch();
  const { handleSubmit } = useFormContext<SearchFormValues>();
  const [searchParams, setSearchParams] = useSearchParams();

  const onSubmit = (data: SearchFormValues) => {
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
        <Title />
        <Sort />
        <Filter />

        <div className={styles.formBtns}>
          <SubmitClearBtns />
          {closeBtn}
        </div>
      </form>
    </>
  );
}

function SearchBar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { state } = useSearch();
  const methods = useForm<SearchFormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: state,
    shouldUnregister: false,
  });

  return (
    <FormProvider {...methods}>
      {/* Mobile Toggle */}
      <button
        className={styles.searchMobileToggle}
        onClick={() => setIsMobileOpen(true)}>
        <IoSearchSharp />
      </button>

      {/* Mobile Modal */}
      <div className={`${!isMobileOpen && "hidden"}`}>
        <Modal isShow={true} setIsShow={setIsMobileOpen}>
          <div className={styles.searchModal}>
            <SearchForm
              onClose={() => setIsMobileOpen(false)}
              closeBtn={
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsMobileOpen(false)}>
                  Close
                </button>
              }
            />
          </div>
        </Modal>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`${styles.searchSidebar} ${
          isCollapsed ? styles.collapsed : styles.expanded
        }`}>
        <button
          className={`${styles.collapseBtn} btn-secondary`}
          onClick={() => setIsCollapsed((prev) => !prev)}>
          <IoSearchSharp />
        </button>

        <div className={`${isCollapsed && "hidden"}`}>
          <SearchForm />
        </div>
      </aside>
    </FormProvider>
  );
}

export default SearchBar;
