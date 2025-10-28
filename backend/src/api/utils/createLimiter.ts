/** @format */

// utils/createOtpLimiter.js
import rateLimit from "express-rate-limit";

import { Request } from "express";

interface RateLimitOptions {
  windowMs: number; // time window in ms (e.g. 3 * 60 * 1000 = 3 minutes)
  max: number; // max number of requests allowed per window

  // response message when limit is exceeded
  message: string;

  // function to generate a unique key per request (default: req.ip)
  keyGenerator?: (req: Request) => string;

  // whether to include standard RateLimit-* headers
  standardHeaders?: boolean;

  // whether to include legacy X-RateLimit-* headers
  legacyHeaders?: boolean;
}

export function createLimiter({
  max,
  windowMs,
  message,
  keyGenerator,
  standardHeaders = true,
  legacyHeaders = false,
}: RateLimitOptions) {
  return rateLimit({
    windowMs, // e.g., 3 * 60 * 1000 = 3 minutes
    max, // e.g., 1 request in the window
    message:
      typeof message === "function" ? message : { status: "fail", message },
    keyGenerator: keyGenerator || ((req) => req.ip || "unknown"), // default to IP if not provided
    standardHeaders,
    legacyHeaders,
  });
}
