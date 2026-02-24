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

const blogRouter = express.Router();

// ------------ BLOGS ------------
// get single blog by slug
blogRouter.route("/slug/:slug").get(getOneBlogBySlug);

// get multiple blogs with query & create blog
blogRouter.route("/").get(getMultBlog).post(protect, createBlog);

blogRouter
  .route("/:id")
  .get(getOneBlogById) //get one blog by id
  .patch(protect, updateBlog) // update blog
  .delete(protect, deleteBlog); // get single blog by id

// ------------ CMTS ------------
// get cmt
blogRouter
  .route("/:id/cmt")
  .get(getCmtByBlog)
  .post(protect, cmtLimitersPerHour, cmtLimitersPerMin, createCmt);

export default blogRouter;
