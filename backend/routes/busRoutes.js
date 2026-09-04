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

// Passenger & Conductor search (requires JWT auth)
router.get('/search', protect, authorize('passenger', 'conductor'), searchBuses);

// Driver
router.get('/mine', protect, authorize('driver'), getMyBuses);
router.post('/', protect, authorize('driver'), createBus);
router.put('/:id/status', protect, authorize('driver'), updateStatus);

// Conductor
router.put('/:id/details', protect, authorize('conductor'), updateBusDetails);
router.put('/:id/seats', protect, authorize('conductor'), updateSeats);
router.put('/:id/location', protect, authorize('conductor'), updateLocation);
router.put('/:id/location/stop', protect, authorize('conductor'), stopTracking);

// Passenger — live location & bus details (keep last: avoids clashing with /search or /mine)
router.get('/:id/location', getBusLocation);
router.get('/:id', protect, authorize('passenger', 'conductor', 'driver', 'admin'), getBusById);

export default router;


