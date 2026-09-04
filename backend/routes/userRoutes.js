import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  registerStaff,
  getStaffList,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
} from '../controllers/userController.js';

const router = express.Router();

// Passenger profile management
router.get('/me', protect, authorize('passenger'), getMyProfile);
router.put('/me', protect, authorize('passenger'), updateMyProfile);
router.delete('/me', protect, authorize('passenger'), deleteMyAccount);

// Admin-only: onboard Drivers & Conductors
router.post('/register-staff', protect, authorize('admin'), registerStaff);
router.get('/staff', protect, authorize('admin'), getStaffList);

export default router;
