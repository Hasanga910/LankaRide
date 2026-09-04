import express from 'express';
import { login, registerPassenger } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register-passenger', registerPassenger); // anyone can self-register as a Passenger

export default router;
