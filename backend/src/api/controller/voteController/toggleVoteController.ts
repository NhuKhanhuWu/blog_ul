/** @format */

import mongoose from "mongoose";
import { IVote } from "../../interface/IVote";
import { BlogModel } from "../../model/blogModel";
import CommentModel from "../../model/commentModel";
import VoteModel from "../../model/voteModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";

interface IGetAction {
  existingVote: IVote;
  voteType: number;
}

interface IUpdateVoteScore {
  targetType: string;
  targetId: string;
  delta: number;
}

const updateVoteScore = async ({
  targetType,
  targetId,
  delta,
}: IUpdateVoteScore) => {
  const TargetModel = (
    targetType === "blog" ? BlogModel : CommentModel
  ) as mongoose.Model<any>;

  const result = await TargetModel.updateOne(
    { _id: targetId },
    { $inc: { voteScore: delta } },
  );

  if (result.matchedCount === 0) throw new AppError("Target not found", 404);
};

const getAction = ({ existingVote, voteType }: IGetAction) => {
  let action, delta;
  if (!existingVote) {
    action = "create";
    delta = voteType;
  }
  // same vote type => delete vote
  else if (existingVote.voteType === voteType) {
    action = "delete";
    delta = -voteType;
  }

  // diff vote type => opposite type
  else {
    action = "update";
    delta = voteType * 2;
  }

  return { action, delta };
};

export const toggleVote = catchAsync(async (req, res) => {
  // get user, target, vote type
  const userId = req.user?._id;
  const { targetId, voteType, targetType } = req.body;

  if (!targetId || !voteType || !targetType)
    throw new AppError("targetId, voteIype, and targetType are required!", 400);

  if (voteType !== 1 && voteType !== -1)
    throw new AppError("Invalid voteType!", 400);

  if (targetType !== "blog" && targetType !== "comment")
    throw new AppError("Invalid targetType", 400);

  // get action type, delta
  const existingVote = (await VoteModel.findOne({
    userId,
    targetId,
    targetType,
  })) as IVote;

  const { action, delta } = getAction({ existingVote, voteType });

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
  //   update vote
  else {
    await VoteModel.findByIdAndUpdate(existingVote._id, {
      voteType,
    });
  }
  //--------- update/create/delete vote document -----------

  // update cache value in target
  await updateVoteScore({ targetType, targetId, delta });

  //   response
  res.json({
    success: true,
    action, // create | update | delete
    voteType: action === "delete" ? 0 : voteType,
    delta, // so FE can update UI
  });
});
