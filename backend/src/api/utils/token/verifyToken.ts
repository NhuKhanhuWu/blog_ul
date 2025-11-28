/** @format */
import jwt from "jsonwebtoken";

export default function verifyToken(token: string, secret: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, { ignoreExpiration: true }, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}
