/** @format */

// src/config/redis.ts
import { createClient } from "redis";

// get redis url (ví dụ: redis://localhost:6379 hoặc redis://:password@host:port)
const REDIS_URL =
  (process.env.NODE_ENV === "development"
    ? process.env.REDIS_URL
    : process.env.REDIS_URL_PROD) || "redis://localhost:6379";

if (!REDIS_URL) {
  throw new Error("Please config REDIS_URL in env file");
}

const redisClient = createClient({
  url: REDIS_URL,
});

// Lắng nghe các sự kiện kết nối
redisClient.on("connect", () => {
  console.log("🔌 Redis Client connecting...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis Client ready!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client error:", err);
});

redisClient.on("end", () => {
  console.log("Disconnected from Redis");
});

// reconnect function
export const connectRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export { redisClient };
