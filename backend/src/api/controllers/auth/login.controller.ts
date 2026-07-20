/** @format */

import { Document, Types } from "mongoose";
import RefreshToken from "../../models/refresh-token.model";
import UserModel, { checkUserPassword } from "../../models/user.model";
import { UserDocument } from "../../types/user.type";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/token/create-token";

type PlainUser = Omit<
  UserDocument,
  keyof Document | "checkPassword" | "changedPasswordAfter"
> & { _id: Types.ObjectId };

const handleToken = async (user: PlainUser) => {
  // ------TOKEN---------
  const refreshToken = createRefreshToken(
    user._id.toString(),
    user.tokenVersion || 0,
  );
  const accessToken = createAccessToken(
    user._id.toString(),
    user.tokenVersion || 0,
  );

  // save token to db
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    sessionExpiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
  }).catch((err) => console.error("Background Session creation failed:", err));

  return { refreshToken, accessToken };
};

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  //check user and password
  // Fetch plain object via .lean() for maximum query speed and low memory usage
  const user = await UserModel.findOne({ email }).select("+password").lean();

  if (!user || !(await checkUserPassword(password, user.password)))
    throw new AppError("Incorrect email or password", 401);

  // if ok, send token (access and refresh)
  req.user = { id: user._id.toString(), _id: user._id };

  // token
  const { refreshToken, accessToken } = await handleToken(user);

  // save to cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 20 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  // response
  res.status(200).json({
    status: "success",
    accessToken,
    // send refreshToken to save in localStorage => simulate cookie
    refreshToken,
  });
});
