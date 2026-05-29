/** @format */
import express from "express";
import { createBlogList } from "../controllers/blog-list/create-blog-list.controller";
import {
  addBlogToList,
  removeBlogFromList,
  updateBlogList,
} from "../controllers/blog-list/update-blog-list.controller";
import { getMultBlogList } from "../controllers/blog-list/get-blog-list.controller";
import { loadUser, protect } from "../middlewares/auth.middleware";
import {
  createBlogListLimiter,
  updateBlogListLimiter,
} from "../middlewares/blog-list.middleware";
import { validateRequest } from "../validation/validateRequest";
import {
  addBlogToListSchema,
  removeBlogFromListSchema,
  updateBlogListSchema,
} from "../validation/blog-list.validation";

const blogListRouter = express.Router();

// get my blog lists
// create blog list
blogListRouter
  .route("/")
  .get(loadUser, getMultBlogList)
  .post(createBlogListLimiter, protect, createBlogList);

// update blog list
blogListRouter
  .route("/:id")
  .patch(
    updateBlogListLimiter,
    validateRequest(updateBlogListSchema),
    protect,
    updateBlogList,
  );

// add blog to list
blogListRouter
  .route("/:id/blogs")
  .patch(
    updateBlogListLimiter,
    validateRequest(addBlogToListSchema),
    protect,
    addBlogToList,
  );

// remove blog from list
blogListRouter
  .route("/:id/blogs/:blogId")
  .delete(
    updateBlogListLimiter,
    protect,
    validateRequest(removeBlogFromListSchema),
    removeBlogFromList,
  );
export default blogListRouter;
