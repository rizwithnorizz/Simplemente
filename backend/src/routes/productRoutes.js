import express from "express";
import { getAllProduct, createProduct, editProduct, deleteProduct, uploadImage } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProduct);
router.post("/create", uploadImage, createProduct);
router.delete('/:id', deleteProduct);
router.put("/:id", uploadImage, editProduct);
router.get('/:id', getAllProduct);

export default router;