/** @format */

import express from "express";
import {
  getMultBlog,
  getOneBlogById,
  getOneBlogBySlug,
} from "../controller/blogController/getBlogController";
import { createBlog } from "../controller/blogController/createBlogController";
import { updateBlog } from "../controller/blogController/updateBlogController";
import { deleteBlog } from "../controller/blogController/deleteBlogController";
import { getCmtByBlog } from "../controller/cmtController/getCmtController";
import { createCmt } from "../controller/cmtController/createCmtController";
import { createCmtLimiter } from "../middleware/cmt.middleware";
import { validate } from "../utils/validate";
import { BlogCreateSchema } from "../utils/schema/blogSchema";
import {
  cmtBodySchema,
  createCmtParamsSchema,
} from "../utils/schema/cmtSchema";
import { loadUser, protect } from "../middleware/auth.middleware";
import {
  createBlogLimiter,
  deleteBlogLimiter,
  updateBlogLimiter,
} from "../middleware/blog.middleware";

const blogRouter = express.Router();

// ------------ BLOGS ------------
// get single blog by slug
blogRouter.route("/slug/:slug").get(loadUser, getOneBlogBySlug);

// get multiple blogs with query & create blog
blogRouter
  .route("/")
  .get(getMultBlog)
  .post(
    createBlogLimiter,
    protect,
    validate(BlogCreateSchema, "body"),
    createBlog,
  );

blogRouter
  .route("/:id")
  .get(loadUser, getOneBlogById) //get one blog by id
  .patch(
    updateBlogLimiter,
    protect,
    validate(BlogCreateSchema, "body"),
    updateBlog,
  ) // update blog
  .delete(deleteBlogLimiter, protect, deleteBlog);

// ------------ CMTS ------------
blogRouter
  .route("/:id/cmt")
  .get(loadUser, getCmtByBlog)
  .post(
    createCmtLimiter,
    protect,
    validate(createCmtParamsSchema, "params"),
    validate(cmtBodySchema, "body"),
    createCmt,
  );

export default blogRouter;
