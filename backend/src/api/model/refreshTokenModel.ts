/** @format */

import { IToken } from "../interface/IToken";
import mongoose, { Schema } from "mongoose";

const RefreshTokenSchema = new Schema<IToken>({
  token: {
    type: String,
    require: [true, "Token required"],
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    require: [true, "User id required"],
  },

  sessionExpiresAt: { type: Date, require: true },

  revoked: { type: Boolean, default: false }, // check if token is used
  revokedAt: { type: Date }, // when the token was used
  expiresAt: { type: Date }, // hard-expire
  createdAt: { type: Date, default: Date.now }, // create time
});

// delete token 3 days after revoked
RefreshTokenSchema.index(
  { revokedAt: 1 },
  { expireAfterSeconds: 3 * 24 * 60 * 60 },
);

// delete after expired
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// index for fast query
RefreshTokenSchema.index({ token: 1 }, { unique: true });
RefreshTokenSchema.index({ sessionExpiresAt: 1 });

// add expires date before save
RefreshTokenSchema.pre("save", function (next) {
  const expiresDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000); // 20 days
  this.expiresAt = expiresDate;
  next();
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
