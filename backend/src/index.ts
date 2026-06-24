/** @format */
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import app from "./app";
import { connectRedis } from "./api/utils/redis";

// connect to db
// const isDev = false;
const isDev = process.env.NODE_ENV === "development";
const DATABASE = isDev
  ? process.env.DATABASE_LOCAL
  : process.env.DATABASE_CLOUD;

if (!DATABASE) throw new Error("DATABASE env variable is not set");

let DB = DATABASE;
if (!isDev) {
  if (!process.env.DATABASE_PASSWORD) {
    throw new Error(
      "DATABASE_PASSWORD environment variable is missing for production cloud connection.",
    );
  }
  DB = DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
}

// run server
const startServer = async () => {
  try {
    // connect db
    mongoose.connect(DB);

    // connect redis
    await connectRedis();

    // start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`✅ App running on port ${port}...`);
    });
  } catch (error) {
    console.error("❌ server error:", error);
    process.exit(1);
  }
};

startServer();
