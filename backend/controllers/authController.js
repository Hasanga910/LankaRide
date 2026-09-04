import * as authService from '../services/authService.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (password.length < 5) {
      return res.status(400).json({ message: 'Password must be at least 5 characters' });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
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
    if (!name || !name.trim() || !email || !email.trim() || !password || !contact || !contact.trim()) {
      return res.status(400).json({ message: 'Name, email, password and contact number are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    if (password.length < 5) {
      return res.status(400).json({ message: 'Password must be at least 5 characters' });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
    }
    if (!contact || !/^\d{10}$/.test(contact.trim())) {
      return res.status(400).json({ message: 'Contact number must be exactly 10 digits' });
    }
    const result = await authService.registerPassenger({
      name: name.trim(),
      email: email.trim(),
      password,
      contact: contact.trim(),
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
