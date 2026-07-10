/** @format */
import { z } from "zod";
import { passwordConfirmSchema, passwordSchema } from "./general.validation";

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(
        /^[\p{L}\p{N} ]+$/u,
        "Name must not contain special characters or emoji",
      ),

    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
  }),
});

export const sendSignUpOtpSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
  }),
});
