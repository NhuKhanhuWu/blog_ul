/** @format */

import express from "express";
import { getCategories } from "../controllers/category/get-category.controller";

const categoryRouter = express.Router();

// get category
categoryRouter.route("/").get(getCategories);

export default categoryRouter;
