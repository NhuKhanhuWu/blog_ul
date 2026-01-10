/** @format */
import jwt from "jsonwebtoken";

export default function verifyToken(
  token: string,
  secret: string,
  ignoreExpiration = false
) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, { ignoreExpiration }, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}
