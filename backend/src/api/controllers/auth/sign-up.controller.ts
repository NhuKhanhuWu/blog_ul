/** @format */
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/error/catch-async";
import AppError from "../../utils/error/app-error";
import UserModel from "../../models/user.model";
import { otpEmail } from "../../utils/email/email-template";
import { sendTokenEmail } from "../../utils/email/email-service";
import getToken from "../../utils/token/get-token";
import { redisClient } from "../../utils/redis";
import crypto from "crypto";

// 1. send verification email (otp)
export const sendSignUpOtp = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // 1. get & check email
    const { email } = req.body as { email?: string };
    if (!email) throw new AppError("Email required", 400);

    // 1.1 check if already in use
    const isUserExists = await UserModel.exists({ email });
    if (isUserExists) throw new AppError("Email already in use", 409);

    // 2. create otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. save request to redis
    const redisKey = `otp:register:${email}`;
    try {
      await redisClient.setEx(
        redisKey,
        Number(process.env.TTL_IN_SECONDS || 10 * 60),
        JSON.stringify({ otp, attempts: 0 }),
      );
    } catch (err) {
      throw new AppError("Unable to create OTP, please try again later!", 500);
    }

    // 4. send email
    const emailMessage = otpEmail(otp);
    await sendTokenEmail({
      email,
      subject: "Your sign up OTP in Blogie",
      htmlMessage: emailMessage,
    });

    res.status(200).json({
      status: "success",
      message: "OTP sended to email",
    });
  },
);

// 2. check otp
export const checkOtp = catchAsync(async (req, res) => {
  // check if otp and email is sended
  const { otp: candidateOtp, email } = req.body;

  // get otp from redis
  const redisKey = `otp:register:${email}`;
  const redisOtp = await redisClient.get(redisKey);

  if (!redisOtp) {
    throw new AppError(
      "OTP has expired or never requested. Please try again.",
      400,
    );
  }

  const data = JSON.parse(redisOtp);

  // check if otp valid
  if (String(candidateOtp) !== String(data.otp)) {
    data.attempts += 1;
    await redisClient.setEx(redisKey, 5 * 60, JSON.stringify(data));
    throw new AppError("Invalid OTP", 400);
  }

  // avoid brute-force: wrong over 5 times => delete otp
  if (data.attempts >= 5) {
    await redisClient.del(redisKey);
    throw new AppError(
      "Too many wrong attempts. Please request a new OTP.",
      400,
    );
  }

  // delete token
  await redisClient.del(redisKey);

  // create token
  const token = crypto.randomBytes(32).toString("hex");
  const tokenKey = `token:register:${token}`;
  await redisClient.setEx(tokenKey, 5 * 60, email);

  // 5. send result
  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
    token,
  });
});

// 3. create user
export const createUser = catchAsync(async (req, res) => {
  const { token, password, passwordConfirm, username } = req.body;

  // check token
  const redisKey = `token:register:${token}`;
  const email = await redisClient.get(redisKey);

  if (!email) {
    throw new AppError(
      "Reset token is invalid or has expired. Please restart the process.",
      400,
    );
  }

  const existsUser = await UserModel.exists({ email });
  if (existsUser) throw new AppError("Email already in used", 401);

  // create user
  const newUser = await UserModel.create({
    username,
    // role: req.body.role,
    email,
    password,
    passwordConfirm,
  });

  // delete token
  await redisClient.del(redisKey);

  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
});
// SIGN UP CONTROLLERS: END
