/** @format */

import express from "express";
import {
  checkOtp,
  sendSignUpOtp,
  createUser,
} from "../controllers/auth/sign-up.controller";
import { loginLimiter, signupIpLimiter } from "../middlewares/auth.middleware";
import { signupEmailLimiter } from "../middlewares/auth.middleware";
import { login } from "../controllers/auth/login.controller";
import {
  checkResetPasswordToken,
  forgotPassword,
  resetPassword,
} from "../controllers/auth/password.controller";
import { forgotPasswordOtpLimiterIP } from "../middlewares/auth.middleware";
import { forgotPasswordOtpLimiterEmail } from "../middlewares/auth.middleware";
import { getMe, getUserBySlug } from "../controllers/user/get-user.controller";
import { changePass } from "../controllers/user/change-pass.controller";
import {
  changeEmail,
  checkChangeEmailController,
} from "../controllers/user/change-email.controller";
import {
  changeEmailByIPLimiter,
  changePassLimiter,
  updateUserLimiter,
} from "../middlewares/user.middleware";
import { changeEmailByUserLimiter } from "../middlewares/user.middleware";
import logout from "../controllers/auth/logout.controller";
import { refreshToken } from "../controllers/auth/refresh-token.controller";
import {
  getUserBlogVote,
  getUserCmtVote,
} from "../controllers/vote/get-vote.controller";
import { updateMe } from "../controllers/user/update-account.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../validation/validateRequest";
import {
  forgotPasswordSchema,
  loginSchema,
  sendSignUpOtpSchema,
} from "../validation/auth.validation";
import { updateMeSchema } from "../validation/user.validation";
const userRouter = express.Router();

// -------------------- Auth Routes -------------------- //
// sign up route
userRouter.post(
  "/signup",
  signupEmailLimiter,
  signupIpLimiter,
  validateRequest(sendSignUpOtpSchema),
  sendSignUpOtp,
);
userRouter.post("/signup/verify", checkOtp);
userRouter.post("/signup/create-user", createUser);

// login route
userRouter.post("/login", loginLimiter, validateRequest(loginSchema), login);

// logout route
userRouter.post("/logout", logout);

// forgot password route
userRouter.post(
  "/forgot-password",
  forgotPasswordOtpLimiterEmail,
  forgotPasswordOtpLimiterIP,
  validateRequest(forgotPasswordSchema),
  forgotPassword,
);
userRouter.patch(
  "/forgot-password/reset-password",
  checkResetPasswordToken,
  resetPassword,
);

// TODO: create change password here (only require current password)

// refresh token route
userRouter.post("/refresh-token", refreshToken);
// -------------------- Auth Routes -------------------- //

// -------------------- User Routes -------------------- //
userRouter
  .route("/me")
  .get(protect, getMe)
  .patch(updateUserLimiter, validateRequest(updateMeSchema), protect, updateMe);

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
