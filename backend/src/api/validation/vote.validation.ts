/** @format */
import { z } from "zod";
import { objectIdSchema } from "./object-id.validation";

export const toggleVoteSchema = z.object({
  targetId: objectIdSchema,
  voteType: z.number().refine((val) => val === -1 || val === 1, {
    message: "Invalid voteType!",
  }),
  targetType: z.enum(["blog", "comment"], "Invalid targetType"),
});
