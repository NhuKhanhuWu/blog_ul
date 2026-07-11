/** @format */

import { Request, Response } from "express";
import { UserDocument } from "../types/user.type";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/token/create-token";
import RefreshToken from "../models/refresh-token.model";

interface RevokeAndRegenerateTokensOptions {
  forceLogoutOthers?: boolean;
}

export const revokeAndRegenerateTokens = async (
  user: UserDocument,
  req: Request,
  res: Response,
  options: RevokeAndRegenerateTokensOptions = {},
) => {
  const isLogoutOthers =
    options.forceLogoutOthers ?? req.body?.isLogoutOthers ?? true; //log out by default

  // if logout in others device
  if (isLogoutOthers) {
    // increase token version
    user.tokenVersion += 1;

    // create new refresh token
    const refreshToken = createRefreshToken(user.id, user.tokenVersion);

    // save token to db
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      sessionExpiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
    });

    // save token to cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 20 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }

  // create access token
  const accessToken = createAccessToken(user.id, user.tokenVersion);

  return accessToken;
};
