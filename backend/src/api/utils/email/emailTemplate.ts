/** @format */

export interface SendEmailOptions {
  email: string;
  subject?: string;
  html?: string;
  text?: string;
}

const wrapEmail = (content: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>MFlix Email</title>
    <link href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300..800&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: "Parkinsans", sans-serif;
        background-color: #f9f9f9;
        color: #333;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
      }
      .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 20px;
        background-color: #df2143;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${content}
      <div class="footer">
        <p>This is an automated message. Please do not reply.</p>
      </div>
    </div>
  </body>
</html>
`;

export const otpEmail = function (otp: string) {
  const content = `
    <p>Hi there,</p>
    <p>We received a request to sign up for an MFlix account using this email address.</p>
    <p>Your verification code is:</p>
    <p><strong style="font-size: 24px;">🔐 ${otp}</strong></p>
    <p>This code is valid for the next 10 minutes.</p>
    <p>If you did not request this, please ignore this message.</p>
    <p>Thanks,<br />MFlix Team</p>
  `;
  return wrapEmail(content);
};

export const resetPasswordEmail = function (token: string) {
  const content = `
    <p>Hi there,</p>
    <p>We received a request to reset your password for your MFlix account.</p>
    <p>To reset your password, click the link below:</p>
    <a href="${process.env.FRONTEND_URL}/reset-password/${token}" class="btn">
      Reset your password
    </a>
    <p>This link will expire in 5 minutes.</p>
    <p>If you didn’t request this, please ignore this email — your account is safe.</p>
    <p>Thank you,<br />The MFlix Team</p>
  `;
  return wrapEmail(content);
};
