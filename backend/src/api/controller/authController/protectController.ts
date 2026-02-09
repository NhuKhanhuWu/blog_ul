/** @format */
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import getToken from "../../utils/token/getToken";
import UserModel from "../../model/userModel";
import verifyToken from "../../utils/token/verifyToken";
import { IJwtPayload } from "../../interface/IJwtPayload";

export const protect = catchAsync(async (req, res, next) => {
  //   get token and check it's there
  const accessToken = getToken(req);

  if (!accessToken) {
    return next(new AppError("Not authenticated!", 401));
  }

  // check if token expired
  let decode: IJwtPayload;
  try {
    decode = verifyToken(accessToken, process.env.JWT_SECRET!) as IJwtPayload;
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }

  // check if user still exsist
  const user = await UserModel.findById(decode.id);

  if (!user) {
    return next(new AppError("Not authenticated", 401));
  }

  if (user.changedPasswordAfter(decode.iat)) {
    return next(new AppError("Password changed. Please login again!", 401));
  }

  req.user = user;
  next();
});
