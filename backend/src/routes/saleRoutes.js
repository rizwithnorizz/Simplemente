import express from "express";
import { refund, transact } from "../controllers/saleController.js";

const router = express.Router();

router.post('/:id', transact);
router.put('/:id', refund);
export default router;