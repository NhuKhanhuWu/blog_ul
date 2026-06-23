/** @format */

// src/config/redis.ts
import { createClient } from "redis";

// get redis url (ví dụ: redis://localhost:6379 hoặc redis://:password@host:port)
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

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
