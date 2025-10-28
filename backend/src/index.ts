/** @format */
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config({ path: "./config.env" });

// connect to db
if (!process.env.DATABASE) throw new Error("DATABASE env variable is not set");
if (!process.env.DATABASE_PASSWORD)
  throw new Error("DATABASE_PASSWORD env variable is not set");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
