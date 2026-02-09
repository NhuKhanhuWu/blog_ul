/** @format */
import jwt, { JwtPayload } from "jsonwebtoken";

export default function verifyToken(
  token: string,
  secret: string,
  ignoreExpiration = false
): JwtPayload {
  return jwt.verify(token, secret, { ignoreExpiration }) as JwtPayload;
}
