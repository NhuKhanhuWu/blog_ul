/** @format */

import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "../../styles/component/SearchBar.scss";

interface IForm {
  title: string;
}

const formSchema = yup.object().shape({
  title: yup.string().required("Title requires atleast 2 characters!").min(2),
});

export default function SearchTitle() {
  // form handling
  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function submitHandler(data: IForm) {}

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)} className="search-title">
        <input
          type="text"
          placeholder="Search..."
          {...register("title")}></input>
        <button type="submit">
          <FaSearch />
        </button>
      </form>

      {/* err message */}
      {touchedFields.title && errors.title && (
        <p className="error-mgs">*{errors.title.message}</p>
      )}
    </>
  );
}
