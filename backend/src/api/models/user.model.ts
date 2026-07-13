/** @format */

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserDocument } from "../types/user.type";
import { generateUniqueSlug } from "../utils/helpers/generate-unique-slug";
import { BlogListModel } from "./blog-list.model";

const { Schema } = mongoose;

export const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: [true, "User must have a name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
      match: [
        /^[\p{L}\p{N} ]+$/u,
        "Name must not contain special characters or emoji",
      ],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      minlength: [8, "Password must be at least 8 characters"],
      maxLength: [128, "Password must be at most 128 characters"],
      select: false, // don't return password by default
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (this: UserDocument, el: string): boolean {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String, // URL to avatar
      validate: {
        validator: (v: string) => !v || validator.isURL(v),
        message: "Invalid image URL",
      },
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },

    passwordChangedAt: Date,
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

// Middleware to hash password before saving
userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  // hash password before save
  this.password = await bcrypt.hash(this.password, 12);

  // remove password comfirm
  this.passwordConfirm = undefined;

  next();
});

// check password
userSchema.methods.checkPassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// for .lean() document
export async function checkUserPassword(
  candidatePassword: string,
  actualPassword?: string,
) {
  if (!actualPassword) return false;

  return await bcrypt.compare(candidatePassword, actualPassword);
}

// check if password changed after token is issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );
    return JWTTimestamp < changedTimestamp;
  }

  // this means NOT changed
  return false;
};

// for .lean() document
export const hasChangedPasswordAfter = (
  passwordChangeAt?: Date,
  JWTTimestamp?: number,
): boolean => {
  if (passwordChangeAt && JWTTimestamp) {
    const changedTimestamp = Math.floor(passwordChangeAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// create slug & default blog list when user create acc
userSchema.pre("save", async function (next) {
  if (!this.isModified("username")) return next();

  // create slug
  const UserModel = this.constructor as mongoose.Model<any>;
  this.slug = await generateUniqueSlug(
    UserModel,
    this.username,
    this._id.toString(),
  );

  if (this.isNew) {
    // create blog list
    const defaultList = await BlogListModel.exists({
      userId: this._id,
      name: "Read later",
      isDefault: true,
    });

    if (!defaultList) {
      await BlogListModel.create({
        name: "Read later",
        userId: this._id,
        isDefault: true,
        isPrivate: true,
        blogs: [],
      });
    }
  }

  next();
});

// when user update acc
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;

  const name = update?.name ?? update?.$set?.name;
  if (!name) return next();

  const user = await this.model.findOne(this.getQuery());
  if (!user) return next();

  const newSlug = await generateUniqueSlug(
    this.model,
    name,
    user._id.toString(),
  );

  if (update.$set) {
    update.$set.slug = newSlug;
  } else {
    update.slug = newSlug;
  }

  next();
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
