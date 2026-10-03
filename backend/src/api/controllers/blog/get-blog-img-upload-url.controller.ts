/** @format */

import { createBlogImageSignedUploadUrl } from "../../supabase/uploadImages";
import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";

export const getBlogImgUploadUrl = catchAsync(async (req, res) => {
  const userId = req.user?._id.toString();
  const fileName = req.body?.fileName;
  const { id: blogId } = req.params;

  if (!userId) throw new AppError("Not authenticated!", 401);
  if (typeof fileName !== "string" || !fileName.trim()) {
    throw new AppError("File name required", 400);
  }
  if (!blogId) throw new AppError("Blog id required", 400);

  const blog = await BlogModel.findOne({ _id: blogId, userId });
  if (!blog) throw new AppError("Blog not found", 404);

  const uploadData = await createBlogImageSignedUploadUrl(
    userId,
    blogId,
    fileName,
  );

  res.status(200).json({
    status: "success",
    data: uploadData, // contains signedUrl, token, publicUrl, etc.
  });
});
