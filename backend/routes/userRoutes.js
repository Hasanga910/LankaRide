import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { registerStaff, getStaffList } from '../controllers/userController.js';

const router = express.Router();

// Admin-only: onboard Drivers & Conductors
router.post('/register-staff', protect, authorize('admin'), registerStaff);
router.get('/staff', protect, authorize('admin'), getStaffList);

export default router;
