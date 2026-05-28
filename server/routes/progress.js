import { Router } from 'express';
import {
  getProgress,
  createProgress,
  getWeeklyProgress,
  getMonthlyProgress,
  getTrends,
} from '../controllers/progressController.js';
import protect from '../middleware/auth.js';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/', getProgress);
router.post('/', createProgress);
router.get('/weekly', getWeeklyProgress);
router.get('/monthly', getMonthlyProgress);
router.get('/trends', getTrends);

export default router;
