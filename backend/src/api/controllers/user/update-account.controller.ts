/** @format */

import catchAsync from "../../utils/error/catch-async";
import UserModel from "../../models/user.model";

// user can change user name, avatar with this controller
export const updateMe = catchAsync(async (req, res) => {
  const updateData = req.body;

  const user = await UserModel.findByIdAndUpdate(req.user?._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User update successfully.",
    user,
  });
});
