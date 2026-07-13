/** @format */

import { z } from "zod";

export const updateMeSchema = z
  .object({
    body: z.object({
      avatar: z.string().url("Invalid avatar url").optional(),
      username: z.string("Invalid username").optional(),
    }),
  })
  .refine((data) => data.body.avatar || data.body.username, {
    message: "Either avatar or name must be provided",
    path: [],
  });
