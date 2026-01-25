import express from "express";
import { getAllProduct, createProduct, editProduct, deleteProduct, uploadImage, getProductById } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProduct);
router.post("/create", uploadImage, createProduct);
router.delete('/:id', deleteProduct);
router.put("/:id", uploadImage, editProduct);
router.get('/:id', getProductById);

export default router;