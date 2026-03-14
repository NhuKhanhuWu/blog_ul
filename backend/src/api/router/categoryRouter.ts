/** @format */

import express from "express";
import { getCategories } from "../controller/categoryController/getCategoryController";

const categoryRouter = express.Router();

// get category
categoryRouter.route("/").get(getCategories);

export default categoryRouter;
