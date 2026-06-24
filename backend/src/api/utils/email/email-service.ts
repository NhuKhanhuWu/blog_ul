/** @format */
import nodemailer, { Transporter } from "nodemailer";
import { SendEmailOptions } from "./email-template";
import AppError from "../error/app-error";

// This prevents expensive TCP handshake cycles on every single email request.
const transporter: Transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
  port: Number(process.env.EMAIL_PORT) || 2525,
  secure: Number(process.env.EMAIL_PORT) === 465, // Use true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Optional pool configurations for higher throughput production setups:
  pool: true,
  maxConnections: 5,
  // maxMessages: 100,
});

interface SendTokenEmailOptions {
  email: string;
  subject: string;
  htmlMessage?: string;
  plainMessage?: string;
}

//  sendEmail helper
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  //  define email options
  const emailOptions = {
    from: "Mflix <no-reply@mflix.com>",
    to: options.email,
    subject: options.subject || "",
    html: options.html || "",
    text: options.text || "",
  };

  //  send email
  await transporter.sendMail(emailOptions);
};

export const sendTokenEmail = async ({
  email,
  subject,
  htmlMessage = "",
  plainMessage = "",
}: SendTokenEmailOptions): Promise<void> => {
  try {
    await sendEmail({
      email,
      subject,
      text: plainMessage,
      html: htmlMessage,
    });
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);

    throw new AppError(
      "There was an error sending the verification email. Please try again later.",
      500,
    );
  }
};
