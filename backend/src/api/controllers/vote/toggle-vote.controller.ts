/** @format */

import { Model } from "mongoose";
import { UpdateVoteScore, Vote } from "../../types/vote.type";
import { BlogModel } from "../../models/blog.model";
import CommentModel from "../../models/comment.model";
import VoteModel from "../../models/vote.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";

type VoteAction = "create" | "delete" | "update";

// Constants
const VOTE_TYPES = {
  UPVOTE: 1,
  DOWNVOTE: -1,
} as const;

// Score update mappings for different vote actions
const SCORE_UPDATES: Record<
  VoteAction,
  Record<number, Record<string, number>>
> = {
  create: {
    [VOTE_TYPES.UPVOTE]: { upVotes: 1 },
    [VOTE_TYPES.DOWNVOTE]: { downVotes: 1 },
  },
  delete: {
    [VOTE_TYPES.UPVOTE]: { upVotes: -1 },
    [VOTE_TYPES.DOWNVOTE]: { downVotes: -1 },
  },
  update: {
    [VOTE_TYPES.UPVOTE]: { upVotes: 1, downVotes: -1 },
    [VOTE_TYPES.DOWNVOTE]: { upVotes: -1, downVotes: 1 },
  },
};

function getScoreUpdate(
  action: "create" | "delete" | "update",
  currentVoteType: 1 | -1,
) {
  let update;

  if (action === "create") {
    if (currentVoteType === VOTE_TYPES.UPVOTE) update = { upVotes: 1 };
    if (currentVoteType === VOTE_TYPES.DOWNVOTE) update = { downVotes: 1 };
  } else if (action === "delete") {
    if (currentVoteType === VOTE_TYPES.UPVOTE) update = { upVotes: -1 };
    if (currentVoteType === VOTE_TYPES.DOWNVOTE) update = { downVotes: -1 };
  } else if (action === "update") {
    // from Downvote to Upvote: upVotes +1, downVotes -1
    if (currentVoteType === VOTE_TYPES.UPVOTE) {
      update = { upVotes: 1, downVotes: -1 };
    }
    // from Upvote to Downvote: upVotes -1, downVotes +1
    if (currentVoteType === VOTE_TYPES.DOWNVOTE) {
      update = { upVotes: -1, downVotes: 1 };
    }
  }

  return update;
}

const updateVoteScore = async ({
  targetType,
  targetId,
  voteType,
  action,
}: UpdateVoteScore) => {
  const TargetModel: Model<any> =
    targetType === "blog" ? BlogModel : CommentModel;

  let update = getScoreUpdate(action, voteType) as Record<string, number>;

  const target = await TargetModel.findOneAndUpdate(
    { _id: targetId },
    { $inc: update },
    { new: true, select: "upVotes downVotes" },
  );

  if (!target) throw new AppError("Target not found", 404);

  return target;
};

const getAction = (existingVote: Vote | null, voteType: number): VoteAction => {
  if (!existingVote) return "create";
  if (existingVote.voteType === voteType) return "delete";
  return "update";
};

export const toggleVote = catchAsync(async (req, res) => {
  // get user, target, vote type
  const userId = req.user?._id;
  const { targetId, voteType, targetType } = req.body;

  // get existing vote and determine action
  const existingVote = await VoteModel.findOne({
    userId,
    targetId,
    targetType,
  });

  const action = getAction(existingVote, voteType);

  // update/create/delete vote document
  if (action === "create") {
    await VoteModel.create({
      userId,
      targetId,
      targetType,
      voteType,
    });
  } else if (action === "delete") {
    await VoteModel.findByIdAndDelete(existingVote!._id);
  } else {
    await VoteModel.findByIdAndUpdate(existingVote!._id, {
      voteType,
    });
  }

  // update vote scores on target
  const target = await updateVoteScore({
    targetType,
    targetId,
    voteType,
    action,
  });

  // response
  res.status(201).json({
    status: "success",
    action,
    voteType: action === "delete" ? 0 : voteType,
    upVotes: target.upVotes,
    downVotes: target.downVotes,
  });
});
