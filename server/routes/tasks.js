import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import protect from '../middleware/auth.js';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
