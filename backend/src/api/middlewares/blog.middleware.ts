/** @format */

import { createLimiter } from "../utils/core/create-limiter";

export const createBlogLimiter = createLimiter({
  max: 4,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Writing too fast? Take a break to refine your content",
});

export const updateBlogLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 1000, // 1 min
  message: "Writing too fast? Take a break to refine your content",
});

export const deleteBlogLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 1000, // 1 min
});
