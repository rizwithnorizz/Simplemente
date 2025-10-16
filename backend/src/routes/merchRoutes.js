import express from "express";

import { addNewShowcase, deleteShowcase, getShowcase, updateShowcase } from "../controllers/merchController.js";
const router = express.Router();

router.get('/:id', getShowcase);
router.post('/:id', addNewShowcase);
router.put('/:id', updateShowcase);
router.delete('/:id', deleteShowcase);

export default router;