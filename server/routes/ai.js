import { Router } from 'express';
import {
  getRecommendations,
  getDailySuggestion,
} from '../controllers/aiController.js';
import protect from '../middleware/auth.js';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/recommendations', getRecommendations);
router.get('/daily-suggestion', getDailySuggestion);

export default router;
