/** @format */
import { z } from "zod";
import {
  passwordConfirmSchema,
  passwordSchema,
  passwordWithConfirmSchema,
} from "./general.validation";

// ----- general -----
export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    otp: z.string("OTP required"),
  }),
});

// ----- login -----
export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string(),
  }),
});

// --------- forgot pass ----------
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
  }),
});

export const resetPasswordSchema = z.object({
  body: passwordWithConfirmSchema.and(
    z.object({
      token: z.string("Token required"),
      password: passwordSchema,
      passwordConfirm: passwordConfirmSchema,
    }),
  ),
});

// --------- sign up ---------
export const sendSignUpOtpSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
  }),
});

export const createUserSchema = z.object({
  body: passwordWithConfirmSchema.and(
    z.object({
      username: z
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
      token: z.string("Token required"),
    }),
  ),
});
