/** @format */
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/error/catch-async";
import AppError from "../../utils/error/app-error";
import UserModel from "../../models/user.model";
import { otpEmail } from "../../utils/email/email-template";
import { sendTokenEmail } from "../../utils/email/email-service";
import signToken from "../../utils/token/sign-token";
import getToken from "../../utils/token/get-token";
import { redisClient } from "../../utils/redis";

interface DecodedToken extends JwtPayload {
  email: string;
}

// 1. send verification email (otp)
export const sendSignUpOtp = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // 1. get & check email
    const { email } = req.body as { email?: string };
    if (!email) throw new AppError("Email required", 400);

    // 1.1 check if already in use
    const userExists = await UserModel.exists({ email });
    if (userExists) throw new AppError("Email already in use", 409);

    // 2. create otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const TTL_IN_SECONDS = 5 * 60; // 5 mins

    // 3. save request to redis với key dạng otp:register:[email]
    const redisKey = `otp:register:${email}`;

    try {
      await redisClient.set(redisKey, otp, {
        EX: TTL_IN_SECONDS,
      });
    } catch (err) {
      throw new AppError("Unable to create OTP, please try again later!", 500);
    }

    // 4. send email
    const emailMessage = otpEmail(otp);

    // 5. send email & response (Fire off email tracking in the background)
    try {
      await sendTokenEmail({
        email,
        subject: "Your sign up OTP in Blogie",
        htmlMessage: emailMessage,
      });
    } catch (err) {
      throw new AppError(`Failed to dispatch OTP email to ${email}`, 500);
    }

    res.status(200).json({
      status: "success",
      message: "OTP sended to email",
    });
  },
);

// 2. check otp
export const checkOtp = catchAsync(async (req, res) => {
  // 1. check if otp and email is sended
  const { otp, email } = req.body;
  if (!otp || !email) throw new AppError("Otp and email required", 400);

  // 2. check if otp, email is valid
  const redisKey = `otp:register:${email}`;
  const pendingOtp = await redisClient.get(redisKey);
  if (!pendingOtp || pendingOtp !== otp) throw new AppError("Invalid otp", 400);

  // 4. create jwt
  const token = signToken({ email }, "30m");

  // 3. delete token
  await redisClient.del(redisKey);

  // 5. send result
  res.status(200).json({
    status: "success",
    token,
    message: "OTP valid!",
  });
});

// 3. create user
export const createUser = catchAsync(async (req, res) => {
  // get email from token
  const token = getToken(req);
  // check if token is sended
  if (!token)
    throw new AppError(
      "Please validate for email before execute this action!",
      401,
    );

  // check email
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as DecodedToken;
  const { email } = decoded;

  const existsUser = await UserModel.exists({ email });
  if (existsUser) throw new AppError("Email already in used", 401);

  // create user
  const newUser = await UserModel.create({
    name: req.body.name,
    // role: req.body.role,
    email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
});
// SIGN UP CONTROLLERS: END
