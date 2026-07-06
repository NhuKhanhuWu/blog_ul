/** @format */

import express from "express";
import {
  getMultBlog,
  getOneBlogById,
  getOneBlogBySlug,
} from "../controllers/blog/get-blog.controller";
import { createBlog } from "../controllers/blog/create-blog.controller";
import { updateBlog } from "../controllers/blog/update-blog.controller";
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
import {
  createBlogSchema,
  updateBlogSchema,
} from "../validation/blog.validation";
import { createCmtParamsSchema } from "../validation/comment.validation";

const blogRouter = express.Router();

// ------------ BLOGS ------------
// get single blog by slug
blogRouter.route("/slug/:slug").get(loadUser, getOneBlogBySlug);

// get multiple blogs with query & create blog
blogRouter
  .route("/")
  .get(getMultBlog)
  .post(
    protect,
    createBlogLimiter,
    validateRequest(createBlogSchema),
    createBlog,
  );

blogRouter
  .route("/:id")
  .get(loadUser, getOneBlogById) //get one blog by id
  .patch(
    protect,
    updateBlogLimiter,
    validateRequest(updateBlogSchema),
    updateBlog,
  ) // update blog
  .delete(deleteBlogLimiter, protect, deleteBlog);

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
