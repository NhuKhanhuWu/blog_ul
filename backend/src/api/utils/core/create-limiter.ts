/** @format */

import rateLimit from "express-rate-limit";
import { Request } from "express";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

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

// Initialize Redis client (Shared across all limiters)
const REDIS_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REDIS_URL_DEV
    : process.env.REDIS_URL_PROD;
const redisClient = createClient({
  url: REDIS_URL || "redis://localhost:6379",
});

redisClient.connect().catch((err) => {
  console.error("Redis Connection Error for Rate Limiter:", err);
});

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

    // Attach RedisStore to enforce distributed sliding window counter
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),

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
