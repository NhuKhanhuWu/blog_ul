/** @format */
import { z } from "zod";
import {
  passwordConfirmSchema,
  passwordSchema,
  passwordWithConfirmSchema,
} from "./general.validation";

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string(),
  }),
});

export const createUserSchema = z.object({
  body: passwordWithConfirmSchema.and(
    z.object({
      name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters")
        .regex(
          /^[\p{L}\p{N} ]+$/u,
          "Name must not contain special characters or emoji",
        ),
    }),
  ),
});

// --------- forgot pass ----------
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
  }),
});

export const checkResetPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    otp: z.number("OTP required"),
  }),
});

export const resetPasswordSchema = z.object({
  body: passwordWithConfirmSchema.and(
    z.object({
      resetToken: z.string("Token required"),
      password: passwordSchema,
      passwordConfirm: passwordConfirmSchema,
    }),
  ),
});
// --------- forgot pass ----------

export const sendSignUpOtpSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
  }),
});
