/** @format */
import mongoose, { Document, Schema, Model } from "mongoose";
import validator from "validator";

// 1. Define TS interface for the document
export interface Otp extends Document {
  email?: string;
  otp?: string;
  otpExpires: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define schema
const otpSchema: Schema<Otp> = new Schema(
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
  { timestamps: true },
);

// 3. Export model
const OtpModel: Model<Otp> = mongoose.model<Otp>("otp", otpSchema);

export default OtpModel;
