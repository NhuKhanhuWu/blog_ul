/** @format */

import { z } from "zod";
import { objectIdSchema } from "./object-id.validation";

export const updateBlogListValidator = z
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
  });

export const addBlogToListValidator = z.object({
  id: objectIdSchema,
});

export const removeBlogFromListValidator = z.object({
  id: objectIdSchema,
  blogId: objectIdSchema,
});
