/** @format */
import express from "express";
import { createBlogList } from "../controller/blogListController/createBlogListController";
import { updateBlogList } from "../controller/blogListController/updateBlogListController";
import { getBlogListByUser } from "../controller/blogListController/getBlogListController";
import { loadUser, protect } from "../middleware/auth.middleware";
import {
  createBlogListLimiter,
  updateBlogListLimiter,
} from "../middleware/blog-list.middleware";

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
