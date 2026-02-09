/** @format */

import RefreshToken from "../../model/refreshTokenModel";
import UserModel from "../../model/userModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/token/createToken";

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password is sended
  if (!email || !password)
    throw new AppError("Please provide email and password", 400);

  //check user and password
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password)))
    throw new AppError("Incorrect email or password", 401);

  // if ok, send token (access and refresh)
  req.user = user;

  // ------TOKEN---------
  // ------refresh token:start
  // create
  const refreshToken = createRefreshToken(user._id.toString());

  // save to db
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    sessionExpiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
  });

  // save to cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 20 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  // ------refresh token:end

  // ------access token:start
  const accessToken = createAccessToken(user._id.toString());
  // ------access token:end
  // ------TOKEN---------

  // response
  user.password = undefined; // remove password from res
  res.status(200).json({
    status: "success",
    data: { user },
    accessToken,
  });
});
