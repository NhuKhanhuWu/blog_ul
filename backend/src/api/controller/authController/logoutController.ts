/** @format */

import RefreshToken from "../../model/refreshTokenModel";
import catchAsync from "../../utils/catchAsync";

const logout = catchAsync(async (req, res) => {
  // get refresh token
  const { refreshToken } = req.cookies;

  // remove from cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // delete from db
  await RefreshToken.findOneAndDelete({ token: refreshToken });

  // response
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export default logout;
