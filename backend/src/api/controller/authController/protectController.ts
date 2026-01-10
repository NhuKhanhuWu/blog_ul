/** @format */
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import getToken from "../../utils/token/getToken";
import UserModel from "../../model/userModel";
import RefreshToken from "../../model/refreshModel";
import signToken from "../../utils/token/signToken";
import { promisify } from "util";
import { Jwt, verify } from "jsonwebtoken";
import verifyToken from "../../utils/token/verifyToken";

interface JwtPayload {
  id: string;
  exp: number;
  iat: number;
}

export const protect = catchAsync(async (req, res, next) => {
  //   get token and check it's there
  const accessToken = getToken(req);
  const { refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  //   check if user exists
  const decode = (await verifyToken(
    accessToken,
    process.env.JWT_SECRET || "",
    true
  )) as JwtPayload;

  const user = await UserModel.findById((decode as { id: string }).id);

  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // if acces token expired => get new ny refresh token
  if (Date.now() > decode.exp * 1000) {
    // check refresh token
    const isRefreshAble = await RefreshToken.findOne({ token: refreshToken });

    if (!isRefreshAble)
      return next(
        new AppError("Login session expired! Please login again!", 401)
      );

    // create new access token
    let newAccessToken = signToken(
      { id: decode.id },
      process.env.JWT_ACCESS_EXPIRES_IN
    );

    // attach new token to req
    req.accessToken = newAccessToken;
  }

  // Check if password change AFTER token was created
  if (user.changedPasswordAfter((decode as { iat: number }).iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // set user to req object
  req.user = user;
  next();
});
