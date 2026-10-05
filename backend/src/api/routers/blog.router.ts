/** @format */

import express from "express";
import {
  getMultBlog,
  getMyBlogs,
  getMyBlogById,
  getOneBlogBySlug,
} from "../controllers/blog/get-blog.controller";
import { createBlog } from "../controllers/blog/create-blog.controller";
import {
  draftBlog,
  updateBlog,
} from "../controllers/blog/update-blog.controller";
import { deleteBlog } from "../controllers/blog/delete-blog.controller";
import { getCmtByBlog } from "../controllers/comment/get-comment.controller";
import { createCmt } from "../controllers/comment/create-comment.controller";
import {
  createCmtLimiter,
  validateCmtConstraints,
} from "../middlewares/comment.middleware";
import { validateRequest } from "../validation/validateRequest";
import { loadUser, protect } from "../middlewares/auth.middleware";
import {
  createBlogLimiter,
  deleteBlogLimiter,
  updateBlogLimiter,
} from "../middlewares/blog.middleware";
import { updateBlogSchema } from "../validation/blog.validation";
import { createCmtParamsSchema } from "../validation/comment.validation";
import { publishBlog } from "../controllers/blog/publish-blog.controller";
import { getBlogImgUploadUrl } from "../controllers/blog/get-blog-img-upload-url.controller";
import { getMyBlogsSchema } from "../validation/blog-query.validation";

const blogRouter = express.Router();

// ------------ BLOGS ------------
// get single blog by slug
blogRouter.route("/slug/:slug").get(loadUser, getOneBlogBySlug);

// get multiple blogs with query & create blog
blogRouter
  .route("/")
  .get(getMultBlog)
  .post(protect, createBlogLimiter, createBlog);

blogRouter
  .route("/me")
  .get(protect, validateRequest(getMyBlogsSchema), getMyBlogs);

blogRouter.route("/:id/image-upload-url").post(protect, getBlogImgUploadUrl);

blogRouter
  .route("/:id")
  .get(loadUser, getMyBlogById) //get mu blog by id
  .patch(
    protect,
    updateBlogLimiter,
    validateRequest(updateBlogSchema),
    updateBlog,
  ) // update blog
  .delete(protect, deleteBlogLimiter, deleteBlog); //delete blog

// publish blog
blogRouter.route("/:id/publish").patch(protect, publishBlog);

// turn existing blog to draft
blogRouter.route("/:id/draft").patch(protect, draftBlog);

// ------------ CMTS ------------
blogRouter
  .route("/:id/cmt")
  .get(loadUser, getCmtByBlog)
  .post(
    protect,
    createCmtLimiter,
    validateRequest(createCmtParamsSchema),
    validateCmtConstraints,
    createCmt,
  );

export default blogRouter;
