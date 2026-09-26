/** @format */

import { z } from "zod";
import { objectIdSchema } from "./general.validation";

/* -----------------------------------
  Base field validators
----------------------------------- */

export const titleValidator = z
  .string("Title must be string")
  .min(1, "Title cannot be empty")
  .max(150, "Title cannot exceed 150 characters");

export const authorValidator = z
  .string("Author name must be string")
  .min(1, "Author name cannot be empty")
  .max(50, "Author name cannot exceed 50 characters");

export const authorsValidator = z
  .array(authorValidator)
  .max(10, "You can specify up to 10 authors");

export const categoryValidator = objectIdSchema;

export const MAX_CATEGORIES = 50;

export const categoriesValidator = z
  .array(categoryValidator)
  .max(MAX_CATEGORIES, `You can specify up to ${MAX_CATEGORIES} categories`)
  .optional();

/* -----------------------------------
   Image limits
----------------------------------- */

export const MAX_EMBED_IMAGES = 100;
export const MAX_UPLOAD_IMAGES = 5;

/* -----------------------------------
   Content block validators
----------------------------------- */

const textBlockSchema = z
  .object({
    type: z.enum([
      "paragraph",
      "title",
      "section",
      "quote",
      "highlight",
      "meta",
    ]),

    text: z
      .string("Text content is required")
      .min(1, "Text is required")
      .max(10000, "Text block is too long (max 10,000 characters)"),

    img: z.undefined().optional(),
    note: z.undefined().optional(),
    isEmbed: z.undefined().optional(),
  })
  .strict();

const imageBlockSchema = z
  .object({
    type: z.literal("image"),

    img: z.string("Image URL is required").url("Image must be a valid URL"),

    note: z.string().max(500, "Note too long").optional(),

    // true  = embed image
    // false = uploaded image
    isEmbed: z.boolean().optional().default(false),

    text: z.undefined().optional(),
  })
  .strict();

export const contentBlockSchema = z.union([textBlockSchema, imageBlockSchema]);

export type IBlogContent = z.infer<typeof contentBlockSchema>;

/* -----------------------------------
   Content validator
   - Empty content is allowed for draft
   - Image limits always apply
   - Total content length limit always applies
----------------------------------- */

export const contentBlocksValidator = z
  .array(contentBlockSchema)
  .superRefine((blocks, ctx) => {
    const totalLength = blocks.reduce((acc, block) => {
      if ("text" in block && block.text) {
        return acc + block.text.length;
      }

      if ("img" in block && block.img) {
        return acc + block.img.length + (block.note?.length || 0);
      }

      return acc;
    }, 0);

    if (totalLength > 50000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Total content length exceeds 50,000 characters (currently ${totalLength}).`,
      });
    }

    let embedCount = 0;
    let uploadCount = 0;

    for (const block of blocks) {
      if (block.type !== "image") continue;

      if (block.isEmbed) {
        embedCount++;
      } else {
        uploadCount++;
      }
    }

    if (embedCount > MAX_EMBED_IMAGES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Too many embedded images: max ${MAX_EMBED_IMAGES}, got ${embedCount}.`,
      });
    }

    if (uploadCount > MAX_UPLOAD_IMAGES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Too many uploaded images: max ${MAX_UPLOAD_IMAGES}, got ${uploadCount}.`,
      });
    }
  });

/**
 * Used when publishing.
 *
 * Content must contain at least one block.
 */
export const contentValidator = contentBlocksValidator.nonempty(
  "Content cannot be empty",
);

export const publishBlogSchema = z.object({
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
      content: contentBlocksValidator.optional(),
      isPrivate: z.boolean().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Request body cannot be empty",
    }),
});
