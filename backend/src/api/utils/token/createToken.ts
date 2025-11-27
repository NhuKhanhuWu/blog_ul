/** @format */

import { IUserDocument } from "../../interface/IUser";
import RefreshToken from "../../model/refreshModel";
import signToken from "./signToken";
import { Response } from "express";

const createRefreshToken = async (user: IUserDocument, res: Response) => {
  // create refresh token
  const refreshToken = signToken(
    { id: user._id },
    process.env.JWT_REFRESH_EXPIRES_IN
  );

  // save to db
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 20 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

const createAccessToken = (
  user: IUserDocument,
  statusCode: number,
  res: Response
): void => {
  const token = signToken({ id: user._id });

  // remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

export { createAccessToken, createRefreshToken };
