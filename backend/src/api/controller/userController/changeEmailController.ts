/** @format */

import catchAsync from "../../utils/catchAsync";
import { createLimiter } from "../../utils/createLimiter";

// --------------------------- limiters ---------------------------
// export const changeEmailLimiterByUser = createLimiter({
//   max: 1,
//   windowMs: 3 * 60 * 1000,
//   message:
//     "You can only request a password reset once every 3 minutes with your account.",
//   keyGenerator: (req) => req.user?.id,
// });

// export const changeEmailLimiterByIP = createLimiter({
//   max: 10,
//   windowMs: 60 * 60 * 1000,
//   message:
//     "You can only request a password reset 10 times every 1 hour with your device.",
//   keyGenerator: (req) => req.ip || "",
// });
// --------------------------- limiters ---------------------------

// --------------------------- controllers ---------------------------
export const changeEmailController = catchAsync(async (req, res) => {
  // check if password and new email are provided
  // check if password is correct
  // check if new email is not already in use
  // send reset email
  // respond
});

export const checkChangeEmailController = catchAsync(async (req, res) => {
  // check if token is valid (include user id and new email)
  // change email
  // respond
});
// --------------------------- controllers ---------------------------
