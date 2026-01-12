/** @format */

import signToken from "./signToken";

const createRefreshToken = (userId: string) => {
  // create refresh token
  const refreshToken = signToken(
    { id: userId },
    process.env.JWT_REFRESH_EXPIRES_IN
  );

  return refreshToken;
};

const createAccessToken = (userId: string) => {
  const accessToken = signToken({ id: userId }, "20m");
  return accessToken;
};

export { createAccessToken, createRefreshToken };
