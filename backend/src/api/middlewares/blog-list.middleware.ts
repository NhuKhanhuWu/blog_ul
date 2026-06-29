/** @format */

import { createLimiter } from "../utils/core/create-limiter";

export const createBlogListLimiter = createLimiter({
  max: 4,
  windowMs: 60 * 1000, // 1 min
});

export const updateBlogListLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 1000, // 1 min
});

export const deleteBlogListLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 1000, // 1 min
});
