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
import { protect } from "../controller/authController/protectController";
import { changePassController } from "../controller/userController/changePassController";
import {
  changeEmailController,
  changeEmailLimiterByIP,
  changeEmailLimiterByUser,
  checkChangeEmailController,
} from "../controller/userController/changeEmailController";
import logout from "../controller/authController/logoutController";
import { refreshToken } from "../controller/authController/refreshTokenController";
import {
  getUserBlogVote,
  getUserCmtVote,
} from "../controller/voteController/getVoteController";
import { updateMe } from "../controller/userController/updateAccountController";
const userRouter = express.Router();

// -------------------- Auth Routes -------------------- //
// sign up route
userRouter.post("/signup", signupEmailLimiter, signupIpLimiter, sendSignUpOtp);
userRouter.post("/signup/verify", checkOtp);
userRouter.post("/signup/create-user", createUser);

// login route
userRouter.post("/login", login);

// logout route
userRouter.post("/logout", logout);

// forgot password route
userRouter.post(
  "/forgot-password",
  forgotPasswordOtpLimiterEmail,
  forgotPasswordOtpLimiterIP,
  forgotPassword,
);
userRouter.patch(
  "/forgot-password/reset-password",
  checkResetPasswordToken,
  resetPassword,
);

// refresh token route
userRouter.post("/refresh-token", refreshToken);
// -------------------- Auth Routes -------------------- //

// -------------------- User Routes -------------------- //
userRouter.route("/me").get(protect, getMeController).post(protect, updateMe);

userRouter.patch("/change-password", protect, changePassController);

userRouter.post(
  "/change-email",
  protect,
  changeEmailLimiterByUser,
  changeEmailLimiterByIP,
  changeEmailController,
);

userRouter.post("/change-email/verify", checkChangeEmailController);
// -------------------- User Routes -------------------- //

// -------------------- Vote Routes -------------------- //
userRouter.route("/me/my-blog-vote").get(protect, getUserBlogVote);
userRouter.route("/me/my-cmt-vote").get(protect, getUserCmtVote);
// -------------------- Vote Routes -------------------- //

export default userRouter;
