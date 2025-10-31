/** @format */

import UserModel from "../../model/userModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import createSendToken from "../../utils/token/createSendToken";

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password is sended
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  //check user and password
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password)))
    return next(new AppError("Incorrect email or password", 401));

  // if ok, send token
  req.user = user;
  createSendToken(user, 200, res);
});
