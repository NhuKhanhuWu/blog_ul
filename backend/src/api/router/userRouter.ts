/** @format */

import express from "express";
import {
  checkOtp,
  sendSignUpOtp,
  createUser,
  signupEmailLimiter,
  signupIpLimiter,
} from "../controller/authController/signUpController";
import { login } from "../controller/authController/loginController";
import {
  checkResetPasswordToken,
  forgotPassword,
  forgotPasswordOtpLimiterEmail,
  forgotPasswordOtpLimiterIP,
  resetPassword,
} from "../controller/authController/forgotPasswordController";
import { getMeController } from "../controller/userController/getMeController";
import { protect } from "../controller/authController/protect";
import { changePassController } from "../controller/userController/changePassController";
const userRouter = express.Router();

// -------------------- Auth Routes -------------------- //
// sign up route
userRouter.post("/signup", signupEmailLimiter, signupIpLimiter, sendSignUpOtp);
userRouter.post("/signup/verify", checkOtp);
userRouter.post("/signup/create-user", createUser);

// login route
userRouter.post("/login", login);

// forgot password route
userRouter.post(
  "/forgot-password",
  forgotPasswordOtpLimiterEmail,
  forgotPasswordOtpLimiterIP,
  forgotPassword
);
userRouter.patch(
  "/forgot-password/reset-password",
  checkResetPasswordToken,
  resetPassword
);
// -------------------- Auth Routes -------------------- //

// -------------------- User Routes -------------------- //
userRouter.get("/me", protect, getMeController);

userRouter.patch("/change-password", protect, changePassController);
// -------------------- User Routes -------------------- //

export default userRouter;
