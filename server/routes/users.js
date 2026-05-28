import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updateSubscription,
  deleteAccount,
  getAllUsers,
  adminUpdateUser,
  adminDeleteUser,
} from '../controllers/userController.js';
import protect from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = Router();

// All routes are protected
router.use(protect);

// User routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/subscription', updateSubscription);
router.delete('/account', deleteAccount);

// Admin routes
router.get('/admin/all', admin, getAllUsers);
router.put('/admin/:id', admin, adminUpdateUser);
router.delete('/admin/:id', admin, adminDeleteUser);

export default router;
