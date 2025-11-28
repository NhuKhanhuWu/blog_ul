/** @format */

// TODO: learn about cookie
// TODO: update send access token on create, update, delete blog and change password, email

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

import AppError from "./api/utils/AppError";
import globalErrHandler from "./api/controller/errorController";
import userRouter from "./api/router/userRouter";
import blogRouter from "./api/router/blogRouter";

const app = express();
app.use(express.json());
app.use(cookieParser());

// same origin only
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ROUTER
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blogs", blogRouter);

// ERROR
// must use /* not *
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 400));
});

app.use(globalErrHandler);

export default app;
