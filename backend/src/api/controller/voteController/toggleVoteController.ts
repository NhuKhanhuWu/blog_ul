/** @format */

import mongoose, { Model } from "mongoose";
import { IVote } from "../../interface/IVote";
import { BlogModel } from "../../model/blogModel";
import CommentModel from "../../model/commentModel";
import VoteModel from "../../model/voteModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { Request } from "express";

interface IGetAction {
  existingVote: IVote;
  voteType: number;
}

type VoteAction = "create" | "delete" | "update";

interface IUpdateVoteScore {
  targetType: "blog" | "comment";
  targetId: string;
  voteType: 1 | -1;
  action: "create" | "delete" | "update";
}

// const updateVoteScore = async ({
//   targetType,
//   targetId,
//   voteType,
//   action,
// }: IUpdateVoteScore) => {
//   const TargetModel = (
//     targetType === "blog" ? BlogModel : CommentModel
//   ) as mongoose.Model<any>;

//   const result = await TargetModel.updateOne({ _id: targetId });

//   if (result.matchedCount === 0) throw new AppError("Target not found", 404);
// };
const updateVoteScore = async ({
  targetType,
  targetId,
  voteType,
  action,
}: IUpdateVoteScore) => {
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

  const result = await TargetModel.updateOne(
    { _id: targetId },
    { $inc: update },
  );

  if (result.matchedCount === 0) throw new AppError("Target not found", 404);
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

const getQuery = (req: Request) => {
  const userId = req.user?._id;
  const { targetId, voteType, targetType } = req.body;

  if (!targetId || !voteType || !targetType)
    throw new AppError("targetId, voteIype, and targetType are required!", 400);

  if (voteType !== 1 && voteType !== -1)
    throw new AppError("Invalid voteType!", 400);

  if (targetType !== "blog" && targetType !== "comment")
    throw new AppError("Invalid targetType", 400);

  return { targetId, voteType, targetType, userId };
};

export const toggleVote = catchAsync(async (req, res) => {
  // get user, target, vote type
  const { targetId, voteType, targetType, userId } = getQuery(req);

  // get action type
  const existingVote = (await VoteModel.findOne({
    userId,
    targetId,
    targetType,
  })) as IVote;

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
  await updateVoteScore({
    targetType,
    targetId,
    voteType,
    action,
  });

  //   response
  res.json({
    success: true,
    action, // create | update | delete
    voteType: action === "delete" ? 0 : voteType,
  });
});
