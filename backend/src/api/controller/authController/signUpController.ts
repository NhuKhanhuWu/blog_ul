/** @format */
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import validator from "validator";
import UserModel from "../../model/userModel";
import PendingEmailsModel from "../../model/pendingEmailModel";
import { otpEmail } from "../../utils/email/emailTemplate";
import { sendTokenEmail } from "../../utils/email/emailService";
import signToken from "../../utils/token/signToken";
import getToken from "../../utils/token/getToken";
import { createLimiter } from "../../utils/createLimiter";

interface DecodedToken extends JwtPayload {
  email: string;
}

// CREATE RATE LIMITTER: START
// by email
export const signupEmailLimiter = createLimiter({
  max: 1, // 1 request
  windowMs: 60 * 1000, // 3 mins,
  message:
    "You can only request signup OTP once every 1 minute with this email.",
  keyGenerator: (req) => req.body.email,
});

// by IP
export const signupIpLimiter = createLimiter({
  max: 15, // 15 request
  windowMs: 60 * 60 * 1000, // 1 hour,
  message:
    "You can only request signup OTP 15 times every 1 hour with this IP.",
});
// CREATE RATE LIMITTER: END

// SIGN UP CONTROLLERS: START
// 1. send verification email (otp)
export const sendSignUpOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. get & check email
    const { email } = req.body as { email?: string };
    if (!email) throw new AppError("Email required", 400);

    if (!validator.isEmail(email)) throw new AppError("Invalid email", 400);

    // 1.1 check if already in use
    const userExists = await UserModel.findOne({ email });
    if (userExists) throw new AppError("Email already in use", 409);

    // 2. create otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 5 mins

    // 3. save request to db
    await PendingEmailsModel.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { upsert: true, new: true }
    );

    // 4. send email
    const emailMessage = otpEmail(otp);

    // 5. send email & response
    await sendTokenEmail(
      {
        email,
        subject: "Your sign up OTP in Blogie",
        htmlMessage: emailMessage,
      },
      res,
      next
    );
  }
);

// 2. check otp
export const checkOtp = catchAsync(async (req, res) => {
  // 1. check if otp and email is sended
  const { otp, email } = req.body;
  if (!otp || !email) throw new AppError("Otp and email required", 400);

  // 2. check if otp, email is valid
  const pendingEmail = await PendingEmailsModel.findOne({ email });

  if (!pendingEmail || pendingEmail.otpExpires.getTime() < Date.now())
    throw new AppError("Invalid email/otp", 400);

  if (pendingEmail.otp !== otp) throw new AppError("Invalid otp", 400);

  // 3. create jwt
  const token = signToken({ email }, "30m");

  // 4. send result
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
  // chek if token is sended
  if (!token)
    throw new AppError(
      "Please validate for email before execute this action!",
      401
    );

  // check email
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as DecodedToken;
  const { email } = decoded;

  const existsUser = await UserModel.findOne({ email });
  if (existsUser) throw new AppError("Email already in used", 401);

  // create user
  const newUser = await UserModel.create({
    name: req.body.name,
    // role: req.body.role,
    email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // delete request in PendingUser
  await PendingEmailsModel.findOneAndDelete({ email });

  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
  // createAccessToken(newUser, 200, res);
});
// SIGN UP CONTROLLERS: END
