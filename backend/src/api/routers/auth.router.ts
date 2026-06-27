/** @format */

import express from "express";
import { login } from "../controllers/auth/login.controller";
import logout from "../controllers/auth/logout.controller";
import {
  checkResetPasswordToken,
  forgotPassword,
  resetPassword,
} from "../controllers/auth/password.controller";
import { refreshToken } from "../controllers/auth/refresh-token.controller";
import {
  checkOtp,
  createUser,
  sendSignUpOtp,
} from "../controllers/auth/sign-up.controller";
import {
  forgotPasswordOtpLimiterEmail,
  forgotPasswordOtpLimiterIP,
  loginLimiter,
  signupEmailLimiter,
  signupIpLimiter,
} from "../middlewares/auth.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  sendSignUpOtpSchema,
} from "../validation/auth.validation";
import { validateRequest } from "../validation/validateRequest";

const authRouter = express.Router();

// sign up route
authRouter.post(
  "/signup",
  signupEmailLimiter,
  signupIpLimiter,
  validateRequest(sendSignUpOtpSchema),
  sendSignUpOtp,
);
authRouter.post("/signup/verify", checkOtp);
authRouter.post("/signup/create-user", createUser);

// login route
authRouter.post("/login", loginLimiter, validateRequest(loginSchema), login);

// logout route
authRouter.post("/logout", logout);

// forgot password route
authRouter.post(
  "/forgot-password",
  forgotPasswordOtpLimiterEmail,
  forgotPasswordOtpLimiterIP,
  validateRequest(forgotPasswordSchema),
  forgotPassword,
);
authRouter.patch(
  "/forgot-password/reset-password",
  checkResetPasswordToken,
  resetPassword,
);

// refresh token route
authRouter.post("/refresh-token", refreshToken);

export default authRouter;
