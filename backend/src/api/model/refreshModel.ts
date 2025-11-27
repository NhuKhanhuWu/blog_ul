/** @format */

import { NextFunction } from "express";
import { IRefreshToken } from "../interface/IRefreshToken";
import mongoose, { Schema } from "mongoose";

const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: {
    type: String,
    require: [true, "Token required"],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    require: [true, "User id required"],
  },
  tokenExpires: {
    type: Date,
    index: { expires: 0 },
  },
});

// add expires date before save
RefreshTokenSchema.pre("save", function (next) {
  const expiresDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000); // 20 days
  this.tokenExpires = expiresDate;
  next();
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
