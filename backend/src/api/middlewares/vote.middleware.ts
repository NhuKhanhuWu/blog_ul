/** @format */

import { createLimiter } from "../utils/core/create-limiter";

export const burstToggleVoteLimiter = createLimiter({
  max: 3,
  windowMs: 2 * 1000,
  message: "Too many requests. Please slow down.",
});

export const toggleVoteLimiter = createLimiter({
  max: 30,
  windowMs: 60 * 1000, // 1 min
  message: "Too many request. Please again later.",
});
