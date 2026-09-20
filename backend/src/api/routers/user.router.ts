/** @format */

import express from "express";
import { getMe, getUserBySlug } from "../controllers/user/get-user.controller";
import { changePass } from "../controllers/user/change-pass.controller";
import {
  changeEmailCreateOtp,
  changeEmailOtpVerify,
  checkPassAndEmail,
} from "../controllers/user/change-email.controller";
import {
  changeEmailByIPLimiter,
  changePassLimiter,
  updateUserLimiter,
  uploadAvatarLimiter,
  verifyEmailLimiter,
} from "../middlewares/user.middleware";
import { changeEmailByUserLimiter } from "../middlewares/user.middleware";
import {
  getUserBlogVote,
  getUserCmtVote,
} from "../controllers/vote/get-vote.controller";
import {
  getAvatarUploadUrl,
  updateMe,
} from "../controllers/user/update-user.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../validation/validateRequest";
import { updateMeSchema } from "../validation/user.validation";
const userRouter = express.Router();

// user routes
userRouter
  .route("/me")
  .get(protect, getMe)
  .patch(protect, updateUserLimiter, validateRequest(updateMeSchema), updateMe);

// upload avatar
userRouter.get(
  "/avatar-upload-url",
  protect,
  uploadAvatarLimiter,
  getAvatarUploadUrl,
);

// get user infor by slug (public infor)
userRouter.route("/:slug").get(getUserBySlug);

// change password (for authorized user)
userRouter.patch("/change-password", protect, changePassLimiter, changePass);

// change email
userRouter.post(
  "/change-email",
  protect,
  changeEmailByUserLimiter,
  changeEmailByIPLimiter,
  checkPassAndEmail,
  changeEmailCreateOtp,
);
userRouter.post(
  "/change-email/verify",
  protect,
  verifyEmailLimiter,
  changeEmailOtpVerify,
);

// Vote Routes
userRouter.route("/me/my-blog-vote").get(protect, getUserBlogVote);
userRouter.route("/me/my-cmt-vote").get(protect, getUserCmtVote);

export default userRouter;
