/** @format */

import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

type TValidationSource = "body" | "query" | "params";

export const validate =
  (schema: ZodObject, source: TValidationSource = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate source of data (body by default)
      const validatedData = await schema.parseAsync(req[source]);

      // attach parsed data to body
      req[source] = validatedData;

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
