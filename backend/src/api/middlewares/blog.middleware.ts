/** @format */

import { createLimiter } from "../utils/core/create-limiter";

export const createBlogLimiter = createLimiter({
  max: 3,
  windowMs: 60 * 1000, // 1 min
  message: "Creating too many blog? Take a break to refine your content",
  keyGenerator: (req) => {
    return `create-blog:user:${req.user!.id}`;
  },
});

export const updateBlogLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 1000, // 1 min
  message: "Writing too fast? Take a break to refine your content",
  keyGenerator: (req) => {
    return `create-blog:user:${req.user!.id}`;
  },
});

export const deleteBlogLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 1000, // 1 min
  keyGenerator: (req) => {
    return `create-blog:user:${req.user!.id}`;
  },
});
