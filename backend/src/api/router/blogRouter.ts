/** @format */

import express from "express";
import {
  getMultBlog,
  getSingleBlog,
} from "../controller/blogController/getBlogController";

const blogRouter = express.Router();

// get blogs
blogRouter.get("/", getMultBlog); // get multiple blogs with query
blogRouter.get("/:id", getSingleBlog); // get single blog by id

// create blog
// blogRouter.post("/", createBlog);

export default blogRouter;
