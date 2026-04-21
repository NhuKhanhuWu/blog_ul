/** @format */

import { createLimiter } from "../utils/core/create-limiter";

export const createBlogListLimiter = createLimiter({
  max: 4,
  windowMs: 60 * 60 * 100, // 1 hour
  message: "Too many request. Please try again later",
});

export const updateBlogListLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 100, // 1 min
  message: "Too many request. Please try again later",
});

export const deleteBlogListLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 100, // 1 min
  message: "Too many request. Please try again later",
});
