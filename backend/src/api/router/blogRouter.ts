/** @format */

import express from "express";
import {
  getMultBlog,
  getOneBlogById,
  getOneBlogBySlug,
} from "../controller/blogController/getBlogController";
import { createBlog } from "../controller/blogController/createBlogController";
import { protect } from "../controller/authController/protectController";
import { updateBlog } from "../controller/blogController/updateBlogController";
import { deleteBlog } from "../controller/blogController/deleteBlogController";
import { getCmtByBlog } from "../controller/cmtController/getCmtController";
import {
  cmtLimitersPerHour,
  cmtLimitersPerMin,
  createCmt,
} from "../controller/cmtController/createCmtController";
import { loadUser } from "../controller/authController/loadUserController";
import { validate } from "../utils/validate";
import { BlogCreateSchema } from "../utils/schema/blogSchema";
import {
  cmtBodySchema,
  createCmtParamsSchema,
} from "../utils/schema/cmtSchema";

const blogRouter = express.Router();

// ------------ BLOGS ------------
// get single blog by slug
blogRouter.route("/slug/:slug").get(loadUser, getOneBlogBySlug);

// get multiple blogs with query & create blog
blogRouter
  .route("/")
  .get(getMultBlog)
  .post(protect, validate(BlogCreateSchema, "body"), createBlog);

blogRouter
  .route("/:id")
  .get(loadUser, getOneBlogById) //get one blog by id
  .patch(protect, validate(BlogCreateSchema, "body"), updateBlog) // update blog
  .delete(protect, deleteBlog);

// ------------ CMTS ------------
blogRouter
  .route("/:id/cmt")
  .get(loadUser, getCmtByBlog)
  .post(
    protect,
    cmtLimitersPerHour,
    cmtLimitersPerMin,
    validate(createCmtParamsSchema, "params"),
    validate(cmtBodySchema, "body"),
    createCmt,
  );

export default blogRouter;
