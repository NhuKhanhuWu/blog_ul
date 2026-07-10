/** @format */

import { z } from "zod";
import { objectIdSchema } from "./general.validation";

/* -----------------------------------
  Base field validators (reusable)
----------------------------------- */

// Title
export const titleValidator = z
  .string("Title must be string")
  .min(1, "Title cannot be empty")
  .max(150, "Title cannot exceed 150 characters");

// Author (single)
export const authorValidator = z
  .string("Author name must be string")
  .min(1, "Author name cannot be empty")
  .max(50, "Author name cannot exceed 50 characters");

// Authors array
export const authorsValidator = z
  .array(authorValidator)
  .max(10, "You can specify up to 10 authors");

// Category (single)
export const categoryValidator = objectIdSchema;

// Categories array
export const categoriesValidator = z
  .array(categoryValidator)
  .max(40, "You can specify up to 40 categories")
  .optional();

const textBlockSchema = z.object({
  text: z
    .string("Text content is required")
    .min(1, "Text is required")
    .max(10000, "Text block is too long (max 10,000 characters)"),
  heading: z.number().int().min(1).max(6).optional(),
});

const imageBlockSchema = z.object({
  img: z.string().url("Image must be a valid URL"),
  note: z.string().max(500, "Note too long").optional(),
});

/* -----------------------------------
   🧾 Content block validators
----------------------------------- */
// Union of both types
export const contentBlockSchema = z.union([textBlockSchema, imageBlockSchema]);

export type IBlogContent = z.infer<typeof contentBlockSchema>;

// Content array with total length limit (≤ 50,000 chars)
export const contentValidator = z
  .array(contentBlockSchema)
  .nonempty("Content cannot be empty")
  .superRefine((blocks, ctx) => {
    const totalLength = blocks.reduce((acc, block) => {
      if ("text" in block) return acc + block.text.length;
      if ("img" in block)
        return acc + block.img.length + (block.note?.length || 0);
      return acc;
    }, 0);

    if (totalLength > 50000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Total content length exceeds 50,000 characters (currently ${totalLength}).`,
      });
    }
  });

/* -----------------------------------
   🧩 Blog Schemas
----------------------------------- */

export const createBlogSchema = z.object({
  body: z
    .object({
      title: titleValidator,
      authors: authorsValidator,
      categories: categoriesValidator,
      content: contentValidator,
      isPrivate: z.boolean().optional(),
    })
    .strict(),
});

export const updateBlogSchema = z.object({
  body: z
    .object({
      title: titleValidator.optional(),
      authors: authorsValidator.optional(),
      categories: categoriesValidator.optional(),
      content: contentValidator.optional(),
      isPrivate: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Request body cannot be empty",
    }),
});
