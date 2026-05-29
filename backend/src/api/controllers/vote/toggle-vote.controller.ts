/** @format */

import { Model } from "mongoose";
import { UpdateVoteScore, Vote } from "../../types/vote.type";
import { BlogModel } from "../../models/blog.model";
import CommentModel from "../../models/comment.model";
import VoteModel from "../../models/vote.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";

interface IGetAction {
  existingVote: Vote;
  voteType: number;
}

type VoteAction = "create" | "delete" | "update";

const updateVoteScore = async ({
  targetType,
  targetId,
  voteType,
  action,
}: UpdateVoteScore) => {
  const TargetModel: Model<any> =
    targetType === "blog" ? BlogModel : CommentModel;

  let update: Record<string, number> = {};

  if (action === "create") {
    update = voteType === 1 ? { upVotes: 1 } : { downVotes: 1 };
  } else if (action === "delete") {
    update = voteType === 1 ? { upVotes: -1 } : { downVotes: -1 };
  } else if (action === "update") {
    update =
      voteType === 1
        ? { upVotes: 1, downVotes: -1 }
        : { upVotes: -1, downVotes: 1 };
  }

  const target = await TargetModel.findOneAndUpdate(
    { _id: targetId },
    { $inc: update },
    { new: true, select: "upVotes downVotes" },
  );

  if (!target) throw new AppError("Target not found", 404);

  return target;
};

const getAction = ({
  existingVote,
  voteType,
}: IGetAction): { action: VoteAction } => {
  let action: VoteAction;
  if (!existingVote) action = "create";
  // same vote type => delete vote
  else if (existingVote.voteType === voteType) action = "delete";
  // diff vote type => opposite type
  else action = "update";

  return { action };
};

export const toggleVote = catchAsync(async (req, res) => {
  // get user, target, vote type
  const userId = req.user?._id;
  const { targetId, voteType, targetType } = req.body;

  // get action type
  const existingVote = (await VoteModel.findOne({
    userId,
    targetId,
    targetType,
  })) as Vote;

  const { action } = getAction({ existingVote, voteType });

  //--------- update/create/delete vote document -----------
  // create vote
  if (action === "create") {
    await VoteModel.create({
      userId,
      targetId,
      targetType,
      voteType,
    });
  }
  // delete vote
  else if (action === "delete")
    await VoteModel.findByIdAndDelete(existingVote._id);
  // update vote
  else {
    await VoteModel.findByIdAndUpdate(existingVote._id, {
      voteType,
    });
  }
  //--------- update/create/delete vote document -----------

  // update cache value in target
  const target = await updateVoteScore({
    targetType,
    targetId,
    voteType,
    action,
  });

  //   response
  res.status(201).json({
    status: "success",
    action, // create | update | delete
    voteType: action === "delete" ? 0 : voteType,
    upVotes: target.upVotes,
    downVotes: target.downVotes,
  });
});
