import express from "express";

import { getAllEvent, createEvent } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getAllEvent);
router.post('/create', createEvent);


export default router;


