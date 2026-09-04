import * as authService from '../services/authService.js';
import { isValidEmail, isValidPhone } from '../utils/validators.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const registerPassenger = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (contact && !isValidPhone(contact)) {
      return res.status(400).json({ message: 'Contact number must be a valid 10-digit Sri Lankan phone number (e.g. 0771234567)' });
    }
    const result = await authService.registerPassenger({ name, email, password, contact });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
