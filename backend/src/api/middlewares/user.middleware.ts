/** @format */

import { createLimiter } from "../utils/core/create-limiter";

export const changeEmailByUserLimiter = createLimiter({
  max: 1,
  windowMs: 60 * 1000,
  message:
    "You can only request change email every 1 minute with your account.",
  keyGenerator: (req) => req.user?.id,
});

export const changeEmailByIPLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 60 * 1000,
  message:
    "You can only request change email 15 times every 1 hour with your device.",
  keyGenerator: (req) => req.ip || "",
});

export const changePassLimiter = createLimiter({
  max: 5,
  windowMs: 60 * 1000, // 1 min
  message: "Too many request. Please again later",
});

export const updateUserLimiter = createLimiter({
  max: 5,
  windowMs: 60 * 1000, // 1 min
  message: "Too many request. Please again later",
});
