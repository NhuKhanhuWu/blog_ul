/** @format */
import { z } from "zod";
import { Types } from "mongoose";

export const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
  });

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

export const passwordConfirmSchema = z
  .string()
  .min(1, "Please confirm your password");

export const passwordWithConfirmSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });
