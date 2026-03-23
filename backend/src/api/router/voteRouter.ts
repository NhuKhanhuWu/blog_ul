/** @format */

import express from "express";
import { protect } from "../controller/authController/protectController";
import { toggleVote } from "../controller/voteController/toggleVoteController";
import { validate } from "../utils/validate";
import { toggleVoteSchema } from "../utils/schema/voteSchema";

const voteRouter = express.Router();

// toggle vote
voteRouter
  .route("/")
  .post(protect, validate(toggleVoteSchema, "body"), toggleVote);

export default voteRouter;
