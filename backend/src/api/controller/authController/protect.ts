/** @format */

import { promisify } from "util";
import jwt from "jsonwebtoken";

import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import getToken from "../../utils/token/getToken";
import verifyToken from "../../utils/token/verifyToken";
import UserModel from "../../model/userModel";

export const protect = catchAsync(async (req, res, next) => {
  //   get token and check it's there
  const token = getToken(req);

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  //   check if user exists
  const decode = await verifyToken(token, process.env.JWT_SECRET || "");
  const user = await UserModel.findById((decode as { id: string }).id);

  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
});
