/** @format */

// TODO: learn about life circle in react

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

import AppError from "./api/utils/AppError";
import globalErrHandler from "./api/controller/errorController";
import userRouter from "./api/router/userRouter";
import blogRouter from "./api/router/blogRouter";
import blogListRouter from "./api/router/blogListRouter";

const app = express();
app.use(express.json());
app.use(cookieParser());

// trust origin only
const allowedOrigins = ["https://blog-uk-frontend.onrender.com"];

app.use(
  cors({
    origin: (og, cb) => {
      if (!og || allowedOrigins.includes(og)) {
        cb(null, og);
      } else cb(new Error("Not allowed by COSR"));
    },
    credentials: true,
  })
);

// ROUTER
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/blog-list", blogListRouter);

// ERROR
// must use /* not *
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 400));
});

app.use(globalErrHandler);

export default app;
