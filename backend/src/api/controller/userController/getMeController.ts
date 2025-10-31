/** @format */

import catchAsync from "../../utils/catchAsync";

export const getMeController = catchAsync(async (req, res) => {
  // get user from req object
  const user = req.user;

  // send response
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
