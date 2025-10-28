/** @format */

import { IUserDocument } from "../../interface/IUser";
import signToken from "./signToken";
import { Response } from "express";

const createSendToken = (
  user: IUserDocument,
  statusCode: number,
  res: Response
): void => {
  const token = signToken({ id: user._id });

  const cookieOptions: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // only accept https request when in prod
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  // attach cookie to response
  res.cookie("jwt", token, cookieOptions);

  // remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

export default createSendToken;
