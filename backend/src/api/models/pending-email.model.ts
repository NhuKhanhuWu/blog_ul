/** @format */
import mongoose, { Document, Schema, Model } from "mongoose";
import validator from "validator";

// 1. Define TS interface for the document
export interface IPendingEmail extends Document {
  email: string;
  otp?: string;
  otpExpires: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define schema
const pendingEmailSchema: Schema<IPendingEmail> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid email",
      },
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
      required: true,
      index: { expires: 0 }, // auto delete when expired
    },
  },
  { timestamps: true }
);

// 3. Export model
const PendingEmailsModel: Model<IPendingEmail> = mongoose.model<IPendingEmail>(
  "PendingEmails",
  pendingEmailSchema
);

export default PendingEmailsModel;
