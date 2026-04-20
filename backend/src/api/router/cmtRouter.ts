/** @format */
import express from "express";
import { getCmtByUser } from "../controller/cmtController/getCmtController";
import { updateCmt } from "../controller/cmtController/updateCmtController";
import { softDeleteCmt } from "../controller/cmtController/deleteCmtController";
import { authorizedCmt } from "../services/comment.service";
import { protect } from "../middleware/auth.middleware";
import {
  deleteCmtLimiter,
  updateCmtLimiter,
} from "../middleware/cmt.middleware";

const cmtRouter = express.Router();

// get cmt by user
cmtRouter.route("/my-cmt").get(protect, getCmtByUser);

cmtRouter
  .route("/:id")
  .patch(updateCmtLimiter, protect, authorizedCmt, updateCmt) // update cmt
  .delete(deleteCmtLimiter, protect, authorizedCmt, softDeleteCmt); // soft delete cmt

export default cmtRouter;
