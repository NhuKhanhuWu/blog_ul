/** @format */

import express from "express";
import { getMe, getUserBySlug } from "../controllers/user/get-user.controller";
import { changePass } from "../controllers/user/change-pass.controller";
import {
  changeEmailOtpStep,
  changeEmailUpdateStep,
  checkPassAndEmail,
} from "../controllers/user/change-email.controller";
import {
  changeEmailByIPLimiter,
  changePassLimiter,
  updateUserLimiter,
  verifyEmailLimiter,
} from "../middlewares/user.middleware";
import { changeEmailByUserLimiter } from "../middlewares/user.middleware";
import {
  getUserBlogVote,
  getUserCmtVote,
} from "../controllers/vote/get-vote.controller";
import { updateMe } from "../controllers/user/update-account.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../validation/validateRequest";
import { updateMeSchema } from "../validation/user.validation";
const userRouter = express.Router();

// user routes
userRouter
  .route("/me")
  .get(protect, getMe)
  .patch(protect, updateUserLimiter, validateRequest(updateMeSchema), updateMe);

userRouter.route("/:slug").get(getUserBySlug);

userRouter.patch("/change-password", protect, changePassLimiter, changePass);

userRouter.post(
  "/change-email/request",
  protect,
  // changeEmailByUserLimiter,
  // changeEmailByIPLimiter,
  checkPassAndEmail,
  changeEmailOtpStep,
);

userRouter.post(
  "/change-email/verify",
  protect,
  verifyEmailLimiter,
  changeEmailUpdateStep,
);

// Vote Routes
userRouter.route("/me/my-blog-vote").get(protect, getUserBlogVote);
userRouter.route("/me/my-cmt-vote").get(protect, getUserCmtVote);

export default userRouter;
