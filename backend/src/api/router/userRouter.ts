/** @format */

import express from "express";
import {
  checkOtp,
  sendSignUpOtp,
  createUser,
} from "../controller/authController/signUpController";
import { signupIpLimiter } from "../middleware/auth.middleware";
import { signupEmailLimiter } from "../middleware/auth.middleware";
import { login } from "../controller/authController/loginController";
import {
  checkResetPasswordToken,
  forgotPassword,
  resetPassword,
} from "../controller/authController/passwordController";
import { forgotPasswordOtpLimiterIP } from "../middleware/auth.middleware";
import { forgotPasswordOtpLimiterEmail } from "../middleware/auth.middleware";
import {
  getMe,
  getUserBySlug,
} from "../controller/userController/getUserController";
import { changePass } from "../controller/userController/changePassController";
import {
  changeEmail,
  checkChangeEmailController,
} from "../controller/userController/changeEmailController";
import {
  changeEmailByIPLimiter,
  changePassLimiter,
  updateUserLimiter,
} from "../middleware/user.middleware";
import { changeEmailByUserLimiter } from "../middleware/user.middleware";
import logout from "../controller/authController/logoutController";
import { refreshToken } from "../controller/authController/refreshTokenController";
import {
  getUserBlogVote,
  getUserCmtVote,
} from "../controller/voteController/getVoteController";
import { updateMe } from "../controller/userController/updateAccountController";
import { protect } from "../middleware/auth.middleware";
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
userRouter
  .route("/me")
  .get(protect, getMe)
  .post(updateUserLimiter, protect, updateMe);

userRouter.route("/:slug").get(getUserBySlug);

userRouter.patch("/change-password", changePassLimiter, protect, changePass);

userRouter.post(
  "/change-email",
  changeEmailByUserLimiter,
  changeEmailByIPLimiter,
  protect,
  changeEmail,
);

userRouter.post("/change-email/verify", checkChangeEmailController);
// -------------------- User Routes -------------------- //

// -------------------- Vote Routes -------------------- //
userRouter.route("/me/my-blog-vote").get(protect, getUserBlogVote);
userRouter.route("/me/my-cmt-vote").get(protect, getUserCmtVote);
// -------------------- Vote Routes -------------------- //

export default userRouter;
