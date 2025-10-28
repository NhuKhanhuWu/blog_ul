/** @format */

import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers and forwards errors to Express.
 */
const catchAsync =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default catchAsync;
