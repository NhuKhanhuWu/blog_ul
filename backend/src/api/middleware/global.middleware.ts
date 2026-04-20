/** @format */

import { createLimiter } from "../utils/createLimiter";

export const globalLimiter = createLimiter({
  max: 200,
  windowMs: 60 * 1000,
  message: "Too many request. Please try again later",
});
