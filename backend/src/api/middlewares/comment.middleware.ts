/** @format */

import { createLimiter } from "../utils/core/create-limiter";

export const createCmtLimiter = createLimiter({
  max: 5,
  message: "Too many comments. Please slow down.",
  windowMs: 60 * 1000,
});

export const updateCmtLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 100, // 1 min
  message: "Too many request. Please try again later",
});

export const deleteCmtLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 100, // 1 min
  message: "Too many request. Please try again later",
});
