/** @format */

import rateLimit from "express-rate-limit";
import { Request } from "express";

interface RateLimitOptions {
  windowMs: number; // time window in ms (e.g. 3 * 60 * 1000 = 3 minutes)
  max: number; // max number of requests allowed per window

  // response message when limit is exceeded
  message?: string;

  // function to generate a unique key per request (default: req.ip)
  keyGenerator?: (req: Request) => string;

  // only count fail request
  skipSuccessfulRequests?: boolean;
}

export function createLimiter({
  max,
  windowMs,
  message = "Too many request. Please try again later",
  keyGenerator,
  skipSuccessfulRequests = false,
}: RateLimitOptions) {
  return rateLimit({
    windowMs, // e.g., 3 * 60 * 1000 = 3 minutes
    max, // e.g., 1 request in the window
    message:
      typeof message === "function" ? message : { status: "fail", message },
    skipSuccessfulRequests,

    keyGenerator:
      keyGenerator ||
      ((req) => {
        const clientIp = req.ip || "unknown";

        // if user LOGIN: use User ID
        const userId = req.user?.id;
        if (userId) {
          return `user:${userId}`;
        }

        // get Device ID from header
        const deviceId = req.headers["x-device-id"];

        if (deviceId) {
          // combine IP and Device ID
          return `device:${clientIp}:${deviceId}`;
        }

        // fallback: if request does not have device-id (use tool like postman) => use ip
        return `ip:${clientIp}`;
      }),
  });
}
