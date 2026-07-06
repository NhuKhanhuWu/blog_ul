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

      // req.body can be overwritten completely
      if (validated.body) req.body = validated.body;

      // For query and params, mutate internal parameters instead of replacing the object shell
      if (validated.query) {
        // Clear old raw string properties
        for (const key in req.query) delete req.query[key];
        // Merge fresh typed, coerced values (e.g. actual numbers)
        Object.assign(req.query, validated.query);
      }

      if (validated.params) {
        for (const key in req.params) delete req.params[key];
        Object.assign(req.params, validated.params);
      }

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
