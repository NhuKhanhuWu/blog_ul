/** @format */

import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validate all data from request
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // re-attach validated data to req
      if (validated.body) req.body = validated.body;
      if (validated.query) req.query = validated.query as any;
      if (validated.params) req.params = validated.params as any;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          // Format Zod error
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      return next(error);
    }
  };
