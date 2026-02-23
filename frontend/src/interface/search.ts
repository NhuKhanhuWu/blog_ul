/** @format */

import * as yup from "yup";

export const formSchema = yup.object({
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
