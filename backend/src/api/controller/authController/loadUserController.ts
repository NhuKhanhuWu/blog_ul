/** @format */

import catchAsync from "../../utils/catchAsync";
import getToken from "../../utils/token/getToken";
import verifyToken from "../../utils/token/verifyToken";
import UserModel from "../../model/userModel";
import { IJwtPayload } from "../../interface/IJwtPayload";

export const loadUser = catchAsync(async (req, res, next) => {
  const accessToken = getToken(req);
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) return next();

  try {
    // 1. Thử verify Access Token
    const decoded = verifyToken(
      accessToken,
      process.env.JWT_SECRET!,
    ) as IJwtPayload;
    const user = await UserModel.findById(decoded.id);

    if (user && !user.changedPasswordAfter(decoded.iat!)) {
      req.user = user;
      return next();
    }
  } catch (err: any) {
    return next();
  }

  next();
});
