/** @format */

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

import AppError from "./api/utils/error/app-error";
import globalErrHandler from "./api/controllers/error.controller";
import userRouter from "./api/routers/user.router";
import blogRouter from "./api/routers/blog.router";
import blogListRouter from "./api/routers/blog-list.router";
import cmtRouter from "./api/routers/comment.router";
import voteRouter from "./api/routers/vote.router";
import categoryRouter from "./api/routers/category.router";
import { globalLimiter } from "./api/middlewares/global.middleware";
import authRouter from "./api/routers/auth.router";

const app = express();
app.use(express.json());
app.use(cookieParser());

// trust origin only
const allowedOrigins = [
  "https://blog-uk-frontend.onrender.com",
  "http://localhost:5173",
  "http://localhost:8080",
];

// Trust the first proxy in front of the app
app.set("trust proxy", 1);

app.use(
  cors({
    origin: (og, cb) => {
      if (!og || allowedOrigins.includes(og)) {
        cb(null, true);
      } else cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// GLOBAL LIMITER
app.use(globalLimiter);

// ROUTER
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/blog-list", blogListRouter);
app.use("/api/v1/cmt", cmtRouter);
app.use("/api/v1/votes", voteRouter);
app.use("/api/v1/categories", categoryRouter);

// ERROR
// must use /* not *
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 400));
});

app.use(globalErrHandler);

export default app;
