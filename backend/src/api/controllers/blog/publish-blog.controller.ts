/** @format */

import z from "zod";
import { BlogModel } from "../../models/blog.model";
import AppError from "../../utils/error/app-error";
import catchAsync from "../../utils/error/catch-async";
import { publishBlogDataSchema } from "../../validation/blog.validation";

export const publishBlog = catchAsync(async (req, res) => {
  const { id: blogId } = req.params;
  const userId = req.user?.id;

  // find blog
  const blog = await BlogModel.findOne({
    _id: blogId,
    userId,
  });

  if (!blog) throw new AppError("Blog not found", 404);

  // Validate plain data so strict content schemas do not see Mongoose internals.
  const blogData = blog.toObject?.() ?? blog;
  const validatedBlog = publishBlogDataSchema.safeParse(blogData);

  if (!validatedBlog.success) {
    return res.status(400).json({
      status: "fail",
      message: "Blog is not ready to publish",
      errors: validatedBlog.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Publish
  blog.isDraft = false;

  if (!blog.pub_date) {
    blog.pub_date = new Date();
  }

  const publishedBlog = await blog.save();

  res.status(200).json({
    status: "success",
    message: "Blog published successfully",
    ...publishedBlog.toObject(),
  });
});
