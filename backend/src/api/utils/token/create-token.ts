/** @format */

import signToken from "./sign-token";

const createRefreshToken = (userId: string, tokenVersion: number) => {
  const refreshToken = signToken(
    { id: userId, tokenVersion },
    process.env.JWT_REFRESH_EXPIRES_IN,
  );

  return refreshToken;
};

const createAccessToken = (userId: string, tokenVersion: number) => {
  const accessToken = signToken({ id: userId, tokenVersion }, "20m");
  return accessToken;
};

export { createAccessToken, createRefreshToken };
