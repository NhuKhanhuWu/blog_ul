/** @format */

import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import getToken from "../../utils/token/getToken";
import verifyToken from "../../utils/token/verifyToken";
import UserModel from "../../model/userModel";
import RefreshToken from "../../model/refreshModel";
import signToken from "../../utils/token/signToken";

export const loadUser = catchAsync(async (req, res, next) => {
  const accessToken = getToken(req);
  const { refreshToken } = req.cookies;

  // No token -> public user
  if (!accessToken || !refreshToken) return next();

  // Decode token
  const decode = (await verifyToken(
    accessToken,
    process.env.JWT_SECRET || ""
  )) as JwtPayload;

  // Find user with token's user id
  const user = await UserModel.findById((decode as { id: string }).id);
  if (!user) return next(); // not valid -> public

  // Access token expired → try refresh token
  if (decode.exp && Date.now() > decode.exp * 1000) {
    const isRefreshAble = await RefreshToken.findOne({ token: refreshToken });
    if (!isRefreshAble) return next(); // không refresh được → xem như public

    // create new access token
    req.accessToken = signToken(
      { id: decode.id },
      process.env.JWT_ACCESS_EXPIRES_IN
    );
  }

  // Check if user changed password after the token was issued
  if (user.changedPasswordAfter((decode as { iat: number }).iat)) return next();

  // Gán user vào req
  req.user = user;

  next();
});
