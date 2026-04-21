/** @format */
import express from "express";
import { getCmtByUser } from "../controllers/comment/get-comment.controller";
import { updateCmt } from "../controllers/comment/update-comment.controller";
import { softDeleteCmt } from "../controllers/comment/delete-comment.controller";
import { authorizedCmt } from "../services/comment.service";
import { protect } from "../middlewares/auth.middleware";
import {
  deleteCmtLimiter,
  updateCmtLimiter,
} from "../middlewares/comment.middleware";

const cmtRouter = express.Router();

// get cmt by user
cmtRouter.route("/my-cmt").get(protect, getCmtByUser);

cmtRouter
  .route("/:id")
  .patch(updateCmtLimiter, protect, authorizedCmt, updateCmt) // update cmt
  .delete(deleteCmtLimiter, protect, authorizedCmt, softDeleteCmt); // soft delete cmt

export default cmtRouter;
