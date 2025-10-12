import express from "express";
import { getAllCategory, createCategory } from "../controllers/categoryController.js";
const router = express.Router();


router.get("/", getAllCategory);
router.post("/create", createCategory);

export default router;
