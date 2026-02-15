/** @format */

import Title from "./Title";
import Sort from "./Sort";
import Filter from "./Filter";
import { IoSearchSharp } from "react-icons/io5";
import { useState } from "react";
import { MdOutlineClear } from "react-icons/md";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearch } from "../../context/SearchContext";

const formSchema = yup.object({
  title: yup.string().default(""),

  sort: yup
    .mixed<"-voteScore" | "-pub_date" | "pub_date">()
    .oneOf(["-voteScore", "-pub_date", "pub_date"])
    .required()
    .default("-pub_date"),

  logic: yup
    .mixed<"and" | "or">()
    .oneOf(["and", "or"])
    .required()
    .default("or"),

  categoryName: yup.string().default(""),

  categories: yup
    .array()
    .of(yup.string().required()) // loại bỏ undefined
    .default([]),
});

export type SearchFormValues = yup.InferType<typeof formSchema>;

function Buttons() {
  const { reset } = useFormContext<SearchFormValues>();

  return (
    <div className="form-btn">
      <button className="btn-primary" type="submit">
        Search
      </button>

      <button className="btn-secondary" onClick={() => reset()}>
        Clear
      </button>
    </div>
  );
}

export default function SearchBarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useSearch();
  const methods = useForm({
    defaultValues: {
      title: "",
      sort: "-voteScore",
      logic: "or",
      categoryName: "",
      categories: [],
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = (data: yup.InferType<typeof formSchema>) => {
    dispatch({
      type: "SET_SEARCH",
      payload: {
        title: data.title ?? "",
        sort: data.sort ?? "-pub_date",
        logic: data.logic ?? "or",
        categories: data.categories ?? [],
      },
    });
  };

  return (
    <div className={`search-mobile-container ${!isOpen && "hide"}`}>
      <span
        className="btn-secondary toggle-btn"
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <MdOutlineClear /> : <IoSearchSharp />}
      </span>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={`search-mobile ${isOpen && "show"}`}>
          <Title></Title>
          <Sort></Sort>
          <Filter></Filter>

          <Buttons />
        </form>
      </FormProvider>
    </div>
  );
}
