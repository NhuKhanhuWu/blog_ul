/** @format */

import { createLimiter } from "../utils/core/create-limiter";

// ---- change email -----
export const changeEmailByUserLimiter = createLimiter({
  max: 1,
  windowMs: 60 * 1000,
  message:
    "You can only request change email every 1 minute with your account.",
  keyGenerator: (req) => req.user?.id || "",
});

export const changeEmailByIPLimiter = createLimiter({
  max: 15,
  windowMs: 60 * 60 * 1000,
  message:
    "You can only request change email 15 times every 1 hour with your device.",
  keyGenerator: (req) => req.ip || "",
});

// Prevent an IP from using automated OTP-cracking tools (e.g., maximum of 20 attempts within 5 minutes)
export const verifyEmailLimiter = createLimiter({
  max: 20,
  windowMs: 5 * 60 * 1000,
  message: "Too many attempts from this device. Please try again later.",
});
// ---- change email -----

export const changePassLimiter = createLimiter({
  max: 5,
  windowMs: 60 * 1000, // 1 min
});

export const updateUserLimiter = createLimiter({
  max: 5,
  windowMs: 60 * 1000, // 1 min
});
