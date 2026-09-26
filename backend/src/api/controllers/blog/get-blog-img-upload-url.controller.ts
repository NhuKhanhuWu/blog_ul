/** @format */

import { createBlogImageSignedUploadUrl } from "../../supabase/uploadImages";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";

export const getBlogImgUploadUrl = catchAsync(async (req, res) => {
  const userId = req.user?._id.toString();
  const file = req.body as File;
  const { blogId } = req.params;

  if (!userId) throw new AppError("Not authenticated!", 401);
  if (!file) throw new AppError("File required", 400);
  if (!blogId) throw new AppError("Blog id required", 400);

  const uploadData = await createBlogImageSignedUploadUrl(
    userId,
    blogId,
    file.name,
  );

  res.status(200).json({
    status: "success",
    data: uploadData, // contains signedUrl, token, publicUrl, etc.
  });
});
