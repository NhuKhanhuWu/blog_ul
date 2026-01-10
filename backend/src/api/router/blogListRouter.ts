/** @format */
import express from "express";
import { createBlogList } from "../controller/blogListController/createBlogListController";
import { protect } from "../controller/authController/protectController";
import { updateBlogList } from "../controller/blogListController/updateBlogListController";
import { getBlogListByUser } from "../controller/blogListController/getBlogListController";
import { loadUser } from "../controller/authController/loadUserController";

const blogListRouter = express.Router();

// get my blog lists
// create blog list
blogListRouter
  .route("/")
  .get(loadUser, getBlogListByUser)
  .post(protect, createBlogList);

// update blog list
blogListRouter.route("/:id").patch(protect, updateBlogList);

export default blogListRouter;
