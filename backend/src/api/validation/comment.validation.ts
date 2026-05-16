/** @format */

import { z } from "zod";
import { objectIdSchema } from "./object-id.validation";

// check cmt's id
export const cmtIdSchema = z.object({
  id: objectIdSchema,
});

// check params (/blogs/:id)
export const createCmtParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    parentId: objectIdSchema.optional(),
    content: z
      .string("Comment's content is required")
      .min(1, "Content cannot be empty")
      .max(2000, "Content cannot exceed 2000 characters")
      .trim(),
  }),
});
