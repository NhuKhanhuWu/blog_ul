/** @format */

import { z } from "zod";

const myBlogSortValues = [
  "-updatedAt",
  "updatedAt",
  "-pub_date",
  "pub_date",
  "-upVotes",
] as const;

export const getMyBlogsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().nonnegative().optional(),
      limit: z.coerce.number().int().positive().max(20).optional(),
      sort: z.enum(myBlogSortValues).optional(),
      title: z.string().optional(),
      isDraft: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
      status: z.enum(["all", "draft", "published"]).optional(),
    })
    .strict()
    .refine((query) => query.isDraft === undefined || query.status === undefined, {
      message: "Use either isDraft or status, not both",
      path: ["isDraft"],
    }),
});
