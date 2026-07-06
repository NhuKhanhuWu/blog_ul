/** @format */
import express from "express";
import { createBlogList } from "../controllers/blog-list/create-blog-list.controller";
import {
  addBlogToList,
  removeBlogFromList,
  updateBlogList,
} from "../controllers/blog-list/update-blog-list.controller";
import {
  getBlogFromList,
  getBlogListMeta,
  getMultBlogList,
} from "../controllers/blog-list/get-blog-list.controller";
import { loadUser, protect } from "../middlewares/auth.middleware";
import {
  createBlogListLimiter,
  deleteBlogListLimiter,
  updateBlogListLimiter,
} from "../middlewares/blog-list.middleware";
import { validateRequest } from "../validation/validateRequest";
import {
  addBlogToListSchema,
  getBlogFromListSchema,
  removeBlogFromListSchema,
  updateBlogListSchema,
} from "../validation/blog-list.validation";
import { deleteBlogList } from "../controllers/blog-list/delete-blog-list.controller";

const blogListRouter = express.Router();

blogListRouter
  .route("/")
  .get(loadUser, getMultBlogList) // get my blog lists
  .post(protect, createBlogListLimiter, createBlogList); // create blog list

// update blog list
blogListRouter
  .route("/:id")
  .get(loadUser, getBlogListMeta) // get list detail by id
  .patch(
    protect,
    updateBlogListLimiter,
    validateRequest(updateBlogListSchema),
    updateBlogList,
  )
  .delete(protect, deleteBlogListLimiter, deleteBlogList);

blogListRouter
  .route("/:id/blogs")
  // get blog from list
  .get(loadUser, validateRequest(getBlogFromListSchema), getBlogFromList)
  // add blog to list
  .patch(
    protect,
    updateBlogListLimiter,
    validateRequest(addBlogToListSchema),
    addBlogToList,
  );

// remove blog from list
blogListRouter
  .route("/:id/blogs/:blogId")
  .delete(
    protect,
    updateBlogListLimiter,
    validateRequest(removeBlogFromListSchema),
    removeBlogFromList,
  );
export default blogListRouter;
