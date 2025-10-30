/** @format */

import express from "express";
import {
  getMultBlog,
  getSingleBlog,
} from "../controller/blogController/getBlogController";
import { createBlog } from "../controller/blogController/createBlogController";
import { protect } from "../controller/authController/protect";
import { updateBlog } from "../controller/blogController/updateBlogController";

const blogRouter = express.Router();

// get blogs
blogRouter.get("/", getMultBlog); // get multiple blogs with query
blogRouter.get("/:id", getSingleBlog); // get single blog by id

// create blog
blogRouter.post("/", protect, createBlog);

// update blog
blogRouter.patch("/:id", protect, updateBlog);

export default blogRouter;
