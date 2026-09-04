import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  createBus,
  getMyBuses,
  updateStatus,
  updateBusDetails,
  updateSeats,
  searchBuses,
  getBusById,
  updateLocation,
  stopTracking,
  getBusLocation,
} from '../controllers/busController.js';

const router = express.Router();

// Public — Passenger search (also viewable by anyone, no login required)
router.get('/search', searchBuses);

// Driver
router.get('/mine', protect, authorize('driver'), getMyBuses);
router.post('/', protect, authorize('driver'), createBus);
router.put('/:id/status', protect, authorize('driver'), updateStatus);

// Conductor
router.put('/:id/details', protect, authorize('conductor'), updateBusDetails);
router.put('/:id/seats', protect, authorize('conductor'), updateSeats);
router.put('/:id/location', protect, authorize('conductor'), updateLocation);
router.put('/:id/location/stop', protect, authorize('conductor'), stopTracking);

// Public — bus location & details (keep ID routes last)
router.get('/:id/location', getBusLocation);
router.get('/:id', getBusById);

export default router;

