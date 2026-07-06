/** @format */

import { createLimiter } from "../utils/core/create-limiter";

export const globalLimiter = createLimiter({
  max: 200,
  windowMs: 60 * 1000,
});
