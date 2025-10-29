/** @format */
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import getToken from "../../utils/token/getToken";
import verifyToken from "../../utils/token/verifyToken";
import UserModel from "../../model/userModel";

export const protect = catchAsync(async (req, res, next) => {
  //   get token and check it's there
  const token = getToken(req);

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  //   check if user exists
  const decode = await verifyToken(token, process.env.JWT_SECRET || "");
  const user = await UserModel.findById((decode as { id: string }).id);

  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
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
