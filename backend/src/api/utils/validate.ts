/** @format */

import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

type TValidationSource = "body" | "query" | "params";

export const validate =
  (schema: ZodObject, source: TValidationSource = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate đúng nguồn dữ liệu được chỉ định (mặc định là body)
      const validatedData = await schema.parseAsync(req[source]);

      // Gán ngược lại dữ liệu đã parse (để nhận được data đã transform/strip)
      req[source] = validatedData;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          // Format lại lỗi của Zod để client dễ đọc
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      return next(error);
    }
  };
