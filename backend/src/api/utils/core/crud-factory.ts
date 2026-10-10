/** @format */

// utils/handlerFactory.ts
import { Request, Response } from "express";
import { Model, Types } from "mongoose";
import AppError from "../error/app-error";

export const getOne =
  <T>(Model: Model<T>) =>
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const doc = await Model.findById(id);

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: `No ${Model.modelName} found with that ID`,
      });
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  };

export function getQueryObjectId(
  value: unknown,
  fieldName: string,
): Types.ObjectId {
  if (typeof value !== "string" || !Types.ObjectId.isValid(value)) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }

  return new Types.ObjectId(value);
}

export function buildVisibilityFilter(
  req: Request,
  targetUserId: Types.ObjectId,
): Record<string, unknown> {
  const filter: Record<string, unknown> = {
    userId: targetUserId,
  };

  const isOwner = req.user?._id.toString() === targetUserId.toString();

  if (!isOwner) {
    filter.isPrivate = { $ne: true };
  }

  return filter;
}
