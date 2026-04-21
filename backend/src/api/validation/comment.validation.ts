/** @format */

import { z } from "zod";
import { objectIdSchema } from "./object-id.validation";

// check params (/blogs/:id)
export const createCmtParamsSchema = z.object({
  id: objectIdSchema,
});

// check cmt's id
export const cmtIdSchema = z.object({
  id: objectIdSchema,
});

// check body
export const cmtBodySchema = z.object({
  content: z
    .string("Comment's content is required")
    .min(1, "Content cannot be empty")
    .max(2000, "Content cannot exceed 2000 characters")
    .trim(),

  parentId: objectIdSchema.optional(),
});

export type createCmtParamsSchema = z.infer<typeof createCmtParamsSchema>;
export type createCmtBodySchema = z.infer<typeof cmtBodySchema>;
