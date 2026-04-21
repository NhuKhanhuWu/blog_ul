/** @format */
import express from "express";
import { createBlogList } from "../controllers/blog-list/create-blog-list.controller";
import { updateBlogList } from "../controllers/blog-list/update-blog-list.controller";
import { getBlogListByUser } from "../controllers/blog-list/get-blog-list.controller";
import { loadUser, protect } from "../middlewares/auth.middleware";
import {
  createBlogListLimiter,
  updateBlogListLimiter,
} from "../middlewares/blog-list.middleware";

const blogListRouter = express.Router();

// get my blog lists
// create blog list
blogListRouter
  .route("/")
  .get(loadUser, getBlogListByUser)
  .post(createBlogListLimiter, protect, createBlogList);

// update blog list
blogListRouter
  .route("/:id")
  .patch(updateBlogListLimiter, protect, updateBlogList);

export default blogListRouter;
