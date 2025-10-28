/** @format */
import nodemailer, { Transporter } from "nodemailer";
import { SendEmailOptions } from "./emailTemplate";
import { Response, NextFunction } from "express";
import AppError from "../AppError";

// 1. sendEmail helper

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  // 1. create transporter
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. define email options
  const emailOptions = {
    from: "Mflix <no-reply@mflix.com>",
    to: options.email,
    subject: options.subject || "",
    html: options.html || "",
    text: options.text || "",
  };

  // 3. send email
  await transporter.sendMail(emailOptions);
};

interface SendTokenEmailOptions {
  email: string;
  subject: string;
  htmlMessage?: string;
  plainMessage?: string;
}

export const sendTokenEmail = async (
  {
    email,
    subject,
    htmlMessage = "",
    plainMessage = "",
  }: SendTokenEmailOptions,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await sendEmail({
      email,
      subject,
      text: plainMessage,
      html: htmlMessage,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
}; // 2. sendTokenEmail helper
