/** @format */

import express from "express";
import { protect } from "../controller/authController/protectController";
import { toggleVote } from "../controller/voteController/toggleVote";

const voteRouter = express.Router();

// toggle vote
voteRouter.route("/").post(protect, toggleVote);

export default voteRouter;
