import express from "express";

import { addNewShowcase, deleteShowcase, getShowcase, updateShowcase } from "../controllers/merchController.js";
const router = express.Router();

router.get('/:id', getShowcase);
router.post('/add', addNewShowcase);
router.put('/update/:id', updateShowcase);
router.delete('/delete/:id', deleteShowcase);

export default router;