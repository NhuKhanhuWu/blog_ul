/** @format */

import jwt, { SignOptions } from "jsonwebtoken";

function signToken<T extends object>(
  payload: T,
  expiresIn: string | number = process.env.JWT_EXPIRES_IN || "1d"
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

// import jwt, { SignOptions } from "jsonwebtoken";

// export function signToken<T extends object>(
//   payload: T,
//   expiresIn: string | number = process.env.JWT_EXPIRES_IN || "1d",
//   options: SignOptions = {}
// ): string {
//   return jwt.sign(payload, process.env.JWT_SECRET as string, {
//     expiresIn,
//     ...options,
//   });
// }

// export default signToken;
