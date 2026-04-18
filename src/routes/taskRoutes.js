import express from 'express';
import { createTask, getTasks, deleteTask } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create task
router.post('/', createTask);

// Get all tasks
router.get('/', getTasks);

// Delete task
router.delete('/:id', deleteTask);

export default router;