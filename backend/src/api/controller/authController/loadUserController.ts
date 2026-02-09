/** @format */

import catchAsync from "../../utils/catchAsync";
import getToken from "../../utils/token/getToken";
import verifyToken from "../../utils/token/verifyToken";
import UserModel from "../../model/userModel";
import RefreshToken from "../../model/refreshTokenModel";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/token/createToken";
import { IJwtPayload } from "../../interface/IJwtPayload";

export const loadUser = catchAsync(async (req, res, next) => {
  const accessToken = getToken(req);
  const refreshToken = req.cookies.refreshToken;

  // 1. Chưa đăng nhập → public
  if (!accessToken) return next();

  // 2. Verify access token
  let accessPayload: IJwtPayload;
  try {
    accessPayload = verifyToken(
      accessToken,
      process.env.JWT_SECRET!
    ) as IJwtPayload;
  } catch {
    // access token sai → public
    return next();
  }

  // 3. Find user
  const user = await UserModel.findById(accessPayload.id);
  if (!user) return next();

  // 4. Check password change
  if (accessPayload.iat && user.changedPasswordAfter(accessPayload.iat)) {
    return next();
  }

  // 5. Access token còn hạn → attach user
  if (!accessPayload.exp || Date.now() < accessPayload.exp * 1000) {
    req.user = user;
    return next();
  }

  // 6. Access token hết hạn → thử refresh
  if (!refreshToken) return next();

  const curRefreshToken = await RefreshToken.findOne({
    token: refreshToken,
    revoked: false,
  });

  if (!curRefreshToken) return next();

  // check session expire
  if (new Date(curRefreshToken.sessionExpiresAt) < new Date()) {
    return next();
  }

  // verify refresh token
  let refreshPayload: IJwtPayload;
  try {
    refreshPayload = verifyToken(
      refreshToken,
      process.env.JWT_SECRET!,
      true
    ) as IJwtPayload;
  } catch {
    return next();
  }

  // refresh token không khớp user
  if (refreshPayload.id !== user.id) return next();

  // 7. Rotate refresh token + cấp access token mới
  const newAccessToken = createAccessToken(user.id);
  const newRefreshToken = createRefreshToken(user.id);

  await Promise.all([
    RefreshToken.findByIdAndUpdate(curRefreshToken._id, {
      revoked: true,
      revokedAt: new Date(),
    }),
    RefreshToken.create({
      token: newRefreshToken,
      userId: user.id,
      sessionExpiresAt: curRefreshToken.sessionExpiresAt,
    }),
  ]);

  // set refresh token cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 20 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  // attach
  req.user = user;
  req.accessToken = newAccessToken;

  next();
});
