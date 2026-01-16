/** @format */
import express from "express";
import { protect } from "../controller/authController/protectController";
import { getCmtByUser } from "../controller/cmtController/getCmtController";

const cmtRouter = express.Router();

cmtRouter.route("/my-cmt").get(protect, getCmtByUser);

export default cmtRouter;
