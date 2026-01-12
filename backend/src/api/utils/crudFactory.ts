/** @format */

// utils/handlerFactory.ts
import { Request, Response } from "express";
import { Model, Types } from "mongoose";
import { ObjectId } from "mongodb";
import AppError from "./AppError";

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

export function buildVisibilityFilter(req: Request, res: Response) {
  const rawUserId = req.query.userId;

  if (!rawUserId || Array.isArray(rawUserId)) {
    throw new AppError("Invalid userId", 400);
  }

  let userId: Types.ObjectId;
  try {
    userId = new Types.ObjectId(rawUserId as string);
  } catch (err) {
    throw new AppError("Invalid userId", 400);
  }

  const filter: Record<string, any> = { userId };

  // Not logged in / not owner → only show blogs that are not hidden
  if (!req.user || req.user._id.toString() !== userId.toString()) {
    filter.isPrivate = { $ne: true };
  }

  return filter;
}
