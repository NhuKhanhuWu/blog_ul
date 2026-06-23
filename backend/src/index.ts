/** @format */
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config({ path: "./config.env" });

// connect to db
// const isDev = false;
const isDev = process.env.NODE_ENV === "development";
const DATABASE = isDev
  ? process.env.DATABASE_LOCAL
  : process.env.DATABASE_CLOUD;

if (!DATABASE) throw new Error("DATABASE env variable is not set");
// if (!process.env.DATABASE_PASSWORD)
//   throw new Error("DATABASE_PASSWORD env variable is not set");

// const DB = DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
let DB = DATABASE;
if (!isDev) {
  if (!process.env.DATABASE_PASSWORD) {
    throw new Error(
      "DATABASE_PASSWORD environment variable is missing for production cloud connection.",
    );
  }
  DB = DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
}

mongoose.connect(DB);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
