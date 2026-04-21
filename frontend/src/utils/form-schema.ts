/** @format */

import * as yup from "yup";

export const emaiSchema = yup
  .string()
  .required("Email required")
  .email("Invalid email");

export const passwordSchema = yup
  .string()
  .required("Password required")
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");
