/** @format */

import express from "express";
import { toggleVote } from "../controllers/vote/toggle-vote.controller";
import { validate } from "../validation/validate";
import { toggleVoteSchema } from "../validation/vote.validation";
import { protect } from "../middlewares/auth.middleware";
import { toggleVoteLimiter } from "../middlewares/vote.middleware";

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
