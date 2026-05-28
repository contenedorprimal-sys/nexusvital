import { Router } from 'express';
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityStats,
} from '../controllers/activityController.js';
import protect from '../middleware/auth.js';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/', getActivities);
router.get('/stats', getActivityStats);
router.get('/:id', getActivity);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;
