import express from "express";

import { getAllProduct, createProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProduct);
router.post("/create", createProduct);

export default router;