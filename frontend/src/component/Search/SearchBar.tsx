/** @format */
import { ReactNode, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearch } from "../../context/SearchContext";
import Modal from "../Modal";
import Title from "./Title";
import Sort from "./Sort";
import Filter from "./Filter";
import styles from "../../styles/component/SearchBar.module.scss";

const formSchema = yup.object({
  title: yup.string().default(""),
  sort: yup
    .mixed<"-upVotes" | "-pub_date" | "pub_date">()
    .oneOf(["-upVotes", "-pub_date", "pub_date"])
    .required()
    .default("-upVotes"),
  logic: yup
    .mixed<"and" | "or">()
    .oneOf(["and", "or"])
    .required()
    .default("or"),
  categoryName: yup.string().default(""),
  categories: yup.array().of(yup.string().required()).default([]),
});

export type SearchFormValues = yup.InferType<typeof formSchema>;

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
  const { state, dispatch } = useSearch();

  const methods = useForm<SearchFormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: state,
  });

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

    onClose?.();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={styles.searchForm}>
        <Title />
        <Sort />
        <Filter />

        <div className={styles.formBtns}>
          <SubmitClearBtns />
          {closeBtn}
        </div>
      </form>
    </FormProvider>
  );
}

function SearchBar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className={styles.searchMobileToggle}
        onClick={() => setIsMobileOpen(true)}>
        <IoSearchSharp />
      </button>

      {/* Mobile Modal */}
      <Modal isShow={isMobileOpen} setIsShow={setIsMobileOpen}>
        <div className={styles.searchModal}>
          <SearchForm
            onClose={() => setIsMobileOpen(false)}
            closeBtn={
              <button
                className="btn-secondary"
                onClick={() => setIsMobileOpen(false)}>
                Close
              </button>
            }
          />
        </div>
      </Modal>

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

        {!isCollapsed && <SearchForm />}
      </aside>
    </>
  );
}

export default SearchBar;
