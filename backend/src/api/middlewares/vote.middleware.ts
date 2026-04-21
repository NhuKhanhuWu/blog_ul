/** @format */

import { createLimiter } from "../utils/core/create-limiter";

export const toggleVoteLimiter = createLimiter({
  max: 30,
  windowMs: 60 * 1000, // 1 min
  message: "Too many request. Please again later.",
});
