/** @format */

import * as yup from "yup";
import { ICategory } from "./category.type";

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
  categories: yup
    .array()
    .of(yup.string().required())
    .default([])
    .max(5, "You can only select up to 5 categories at a time"),
});

export type TSearchFormValues = yup.InferType<typeof formSchema>;

export interface ICategoryInput {
  category: ICategory;
  selectedIds: string[];
}
