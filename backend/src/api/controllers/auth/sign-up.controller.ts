/** @format */
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/error/catch-async";
import AppError from "../../utils/error/app-error";
import UserModel from "../../models/user.model";
import OtpModel from "../../models/otp.model";
import { otpEmail } from "../../utils/email/email-template";
import { sendTokenEmail } from "../../utils/email/email-service";
import signToken from "../../utils/token/sign-token";
import getToken from "../../utils/token/get-token";

interface DecodedToken extends JwtPayload {
  email: string;
}

// 1. send verification email (otp)
export const sendSignUpOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. get & check email
    const { email } = req.body as { email?: string };
    if (!email) throw new AppError("Email required", 400);

    // 1.1 check if already in use
    const userExists = await UserModel.findOne({ email });
    if (userExists) throw new AppError("Email already in use", 409);

    // 2. create otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins

    // 3. save request to db
    await OtpModel.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { upsert: true, new: true },
    );

    // 4. send email
    const emailMessage = otpEmail(otp);

    // 5. send email & response (Fire off email tracking in the background)
    sendTokenEmail({
      email,
      subject: "Your sign up OTP in Blogie",
      htmlMessage: emailMessage,
    }).catch((err) => {
      // Catches errors without crashing the active client request cycle
      console.error(
        `Failed to dispatch background OTP email to ${email}:`,
        err,
      );
    });

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
  const pendingEmail = await OtpModel.findOne({ email });

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

  // delete request in PendingUser
  // TODO: update to store otp in redis
  await OtpModel.findOneAndDelete({ email });

  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
});
// SIGN UP CONTROLLERS: END
