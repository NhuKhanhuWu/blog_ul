/** @format */

import * as yup from "yup";

export const emaiSchema = yup
  .string()
  .required("Email required")
  .email("Invalid email");

export const basePasswordSchema = yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

export const passwordSchema = basePasswordSchema.required("Password required");

export const passwordConfirmSchema = yup
  .string()
  .required("Confirm password required")
  .oneOf([yup.ref("password")], "Passwords must match");

export const createOtpSchema = (length = 6) => {
  return yup
    .string()
    .length(length, `OTP must be ${length} digits`)
    .required("OTP required");
};

export const usernameSchema = yup
  .string()
  .required("Username required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters");
