/** @format */

// utils/handlerFactory.ts
import { Request, Response } from "express";
import { Model } from "mongoose";

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
