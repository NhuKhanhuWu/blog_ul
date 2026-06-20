/** @format */

import express from "express";
import { toggleVote } from "../controllers/vote/toggle-vote.controller";
import { validateRequest } from "../validation/validateRequest";
import { toggleVoteSchema } from "../validation/vote.validation";
import { protect } from "../middlewares/auth.middleware";
import {
  burstToggleVoteLimiter,
  toggleVoteLimiter,
} from "../middlewares/vote.middleware";

const voteRouter = express.Router();

// toggle vote
voteRouter
  .route("/")
  .post(
    burstToggleVoteLimiter,
    toggleVoteLimiter,
    protect,
    validateRequest(toggleVoteSchema),
    toggleVote,
  );

export default voteRouter;
