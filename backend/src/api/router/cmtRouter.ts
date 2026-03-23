/** @format */
import express from "express";
import { protect } from "../controller/authController/protectController";
import { getCmtByUser } from "../controller/cmtController/getCmtController";
import { updateCmt } from "../controller/cmtController/updateCmtController";
import { softDeleteCmt } from "../controller/cmtController/deleteCmtController";
import { authorizedCmt } from "../services/comment.service";

const cmtRouter = express.Router();

// get cmt by user
cmtRouter.route("/my-cmt").get(protect, getCmtByUser);

cmtRouter
  .route("/:id")
  .patch(protect, authorizedCmt, updateCmt) // update cmt
  .delete(protect, authorizedCmt, softDeleteCmt); // soft delete cmt

export default cmtRouter;
