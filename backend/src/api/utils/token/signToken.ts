/** @format */

import jwt, { SignOptions } from "jsonwebtoken";

function signToken<T extends object>(
  payload: T,
  expiresIn: string | number = process.env.JWT_ACCESS_EXPIRES_IN || "1d"
): string {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn,
    } as SignOptions
  );
}

export default signToken;
