/** @format */

import { z } from "zod";
import { objectIdSchema } from "./object-id.validation";

export const updateBlogListSchema = z.object({
  body: z
    .object({
      name: z
        .string("Name must be a string")
        .min(1, "Name cannot be empty")
        .max(100, "Name cannot exceed 100 characters")
        .optional(),

      description: z
        .string("Description must be a string")
        .max(500, "Description cannot exceed 500 characters")
        .optional(),

      isPrivate: z.boolean("isPrivate must be a boolean value").optional(),
    })
    // blog empty request case
    .refine((data) => Object.keys(data).length > 0, {
      message:
        "Request body cannot be empty. Please provide at least one field to update.",
    }),
});

export const getBlogFromListSchema = z.object({
  // 1. Path variables (e.g., /api/blog-lists/:id/blogs)
  params: z.object({
    id: objectIdSchema,
  }),

  // 2. Query variables (e.g., ?page=0&limit=10)
  query: z.object({
    page: z.coerce.number().int().nonnegative().default(0),
    limit: z.coerce.number().int().positive().default(10),
  }),
});

export const addBlogToListSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    blogId: objectIdSchema,
  }),
});

export const removeBlogFromListSchema = z.object({
  params: z.object({
    id: objectIdSchema,
    blogId: objectIdSchema,
  }),
});
