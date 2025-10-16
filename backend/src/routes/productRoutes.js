import express from "express";

import { getAllProduct, createProduct, editProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProduct);
router.post("/create", createProduct);
router.delete('/:id', deleteProduct);
router.put("/:id", editProduct);

export default router;