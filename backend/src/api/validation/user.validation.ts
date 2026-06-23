/** @format */

import { z } from "zod";

export const updateMeSchema = z
  .object({
    body: z.object({
      avatar: z.string().url("Invalid avatar url").optional(),
      name: z.string("Invalid username").optional(),
    }),
  })
  .refine((data) => data.body.avatar || data.body.name, {
    message: "Either avatar or name must be provided",
    path: [],
  });
