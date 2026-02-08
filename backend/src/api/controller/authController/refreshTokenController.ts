/** @format */

import { IJwtPayload } from "../../interface/IJwtPayload";
import RefreshToken from "../../model/refreshTokenModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/token/createToken";
import verifyToken from "../../utils/token/verifyToken";

export const refreshToken = catchAsync(async (req, res, next) => {
  // get refresh token from cookie
  const refreshToken = req.cookies.refreshToken;

  // check if exsist
  if (!refreshToken) {
    throw new AppError("Refresh token required", 401);
  }

  // get token from db
  const curRefreshToken = await RefreshToken.findOne({ token: refreshToken });
  if (!curRefreshToken) throw new AppError("Invalid token!", 401);

  // check if token has been used (revoked)
  if (curRefreshToken.revoked)
    throw new AppError("Token has already been used", 401);

  // check if session expired
  const sessionExpireDate = new Date(curRefreshToken.sessionExpiresAt);
  if (sessionExpireDate < new Date(Date.now())) {
    throw new AppError("Session expired! Please login again.", 401);
  }

  // verify token
  let decode: IJwtPayload;
  try {
    decode = verifyToken(
      refreshToken,
      process.env.JWT_SECRET!,
      true
    ) as IJwtPayload;
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }

  // create new  token
  const { userId } = curRefreshToken;
  const accessToken = createAccessToken(userId.toString());
  const newRefreshToken = createRefreshToken(userId.toString());

  // update in db
  await Promise.all([
    // marke cur token as used
    RefreshToken.findByIdAndUpdate(
      { _id: curRefreshToken._id },
      {
        revoked: true,
        revokedAt: new Date(),
      }
    ),

    // create new token
    RefreshToken.create({
      token: newRefreshToken,
      userId,
      sessionExpiresAt: sessionExpireDate,
    }),
  ]);

  // save new refresh token to cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 20 * 24 * 60 * 60 * 1000, // 20 days
    path: "/",
  });

  // send response
  res.status(201).json({
    status: "success",
    accessToken,
  });
});
