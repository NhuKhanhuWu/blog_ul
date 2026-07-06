/** @format */

export interface JwtPayload {
  id: string;
  tokenVersion: number;
  exp: number;
  iat: number;
}
