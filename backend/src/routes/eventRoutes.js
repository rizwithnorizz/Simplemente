import express from "express";

import { getAllEvent, createEvent, editEvent, deleteEvent } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getAllEvent);
router.post('/', createEvent);
router.put('/:id', editEvent);
router.delete('/:id', deleteEvent);


export default router;


