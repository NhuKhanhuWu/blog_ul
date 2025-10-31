/** @format */

import express from "express";
import {
  getCategories,
  getMultBlog,
  getOneBlog,
} from "../controller/blogController/getBlogController";
import { createBlog } from "../controller/blogController/createBlogController";
import { protect } from "../controller/authController/protect";
import { updateBlog } from "../controller/blogController/updateBlogController";
import { deleteBlog } from "../controller/blogController/deleteBlogController";

const blogRouter = express.Router();

// get blogs
blogRouter.get("/", getMultBlog); // get multiple blogs with query
blogRouter.get("/:id", getOneBlog); // get single blog by id

// create blog
blogRouter.post("/", protect, createBlog);

// update blog
blogRouter.patch("/:id", protect, updateBlog);

// delete blog
blogRouter.delete("/:id", protect, deleteBlog);

// get categories
blogRouter.get("/categories/list", getCategories);

export default blogRouter;
