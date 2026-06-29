/** @format */
import express from "express";
import { getCmtByUser } from "../controllers/comment/get-comment.controller";
import { updateCmt } from "../controllers/comment/update-comment.controller";
import { softDeleteCmt } from "../controllers/comment/delete-comment.controller";
import { protect } from "../middlewares/auth.middleware";
import {
  authorizedCmt,
  deleteCmtLimiter,
  updateCmtLimiter,
} from "../middlewares/comment.middleware";

const cmtRouter = express.Router();

// get cmt by user
cmtRouter.route("/my-cmt").get(protect, getCmtByUser);

cmtRouter
  .route("/:id")
  .patch(protect, updateCmtLimiter, authorizedCmt, updateCmt) // update cmt
  .delete(protect, deleteCmtLimiter, authorizedCmt, softDeleteCmt); // soft delete cmt

export default cmtRouter;
