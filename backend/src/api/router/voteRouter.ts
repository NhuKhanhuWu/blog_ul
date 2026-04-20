/** @format */

import express from "express";
import { toggleVote } from "../controller/voteController/toggleVoteController";
import { validate } from "../utils/validate";
import { toggleVoteSchema } from "../utils/schema/voteSchema";
import { protect } from "../middleware/auth.middleware";
import { toggleVoteLimiter } from "../middleware/vote.middleware";

const voteRouter = express.Router();

// toggle vote
voteRouter
  .route("/")
  .post(
    toggleVoteLimiter,
    protect,
    validate(toggleVoteSchema, "body"),
    toggleVote,
  );

export default voteRouter;
