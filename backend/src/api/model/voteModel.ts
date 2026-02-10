/** @format */

import mongoose, { Schema } from "mongoose";
import { IVote } from "../interface/IVote";

const voteSchema = new Schema<IVote>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      required: true,
      enum: ["blog", "comment"], // mở rộng sau
      index: true,
    },

    voteType: {
      type: Number,
      required: true,
      enum: [1, -1], // upvote | downvote
    },
  },
  {
    timestamps: true,
  },
);

// make sure each vote is unique
voteSchema.index(
  {
    userId: 1,
    targetId: 1,
    targetType: 1,
  },
  {
    unique: true,
  },
);

// get total votes of target
voteSchema.index({ targetType: 1, targetId: 1 });

// get vote of user
voteSchema.index({ userId: 1 });

const VoteModel = mongoose.model("Vote", voteSchema);

export default VoteModel;
