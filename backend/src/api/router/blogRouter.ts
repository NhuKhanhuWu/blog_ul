/** @format */

import express from "express";
import {
  getCategories,
  getMultBlog,
  getOneBlogById,
  getOneBlogBySlug,
} from "../controller/blogController/getBlogController";
import { createBlog } from "../controller/blogController/createBlogController";
import { protect } from "../controller/authController/protect";
import { updateBlog } from "../controller/blogController/updateBlogController";
import { deleteBlog } from "../controller/blogController/deleteBlogController";

const blogRouter = express.Router();

// get categories
blogRouter.route("/categories/list").get(getCategories);

// get single blog by slug
blogRouter.route("/slug/:slug").get(getOneBlogBySlug);

// get multiple blogs with query
blogRouter.route("/").get(getMultBlog).post(protect, createBlog);

blogRouter
  .route("/:id")
  .get(getOneBlogById) //get one blog by id
  .patch(protect, updateBlog) // update blog
  .delete(protect, deleteBlog); // get single blog by id

export default blogRouter;
