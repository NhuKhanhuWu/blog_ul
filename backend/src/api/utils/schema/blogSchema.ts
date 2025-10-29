/** @format */

import { z } from "zod";

const TextBlockSchema = z.object({
  text: z.string().min(1, "Text is required"),
  heading: z.number().int().min(1).max(6).optional(),
});

const ImageBlockSchema = z.object({
  img: z.string().url("Image must be a valid URL"),
  note: z.string().optional(),
});

// Union of both types
export const ContentBlockSchema = z.union([TextBlockSchema, ImageBlockSchema]);

export type IBlogContent = z.infer<typeof ContentBlockSchema>;

export const ValidateBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.array(ContentBlockSchema).nonempty("Content cannot be empty"),
  categories: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
});
