/** @format */
import { email, z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
  }),
});
