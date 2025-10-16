import express from "express";
import { getAllCategory, createCategory, deleteCategory } from "../controllers/categoryController.js";
const router = express.Router();


router.get("/", getAllCategory);
router.post("/create", createCategory);
router.delete("/:id", deleteCategory);

export default router;
