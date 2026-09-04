import * as userService from '../services/userService.js';
import { isValidEmail, isValidPhone, isValidNIC } from '../utils/validators.js';

export const registerStaff = async (req, res) => {
  try {
    const { name, email, password, role, nic, contact, licenseNo } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
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
    if (nic && !isValidNIC(nic)) {
      return res.status(400).json({ message: 'NIC must be a valid Sri Lankan NIC (e.g. 901234567V or 199012345678)' });
    }
    const staff = await userService.registerStaff({ name, email, password, role, nic, contact, licenseNo });
    res.status(201).json(staff);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getStaffList = async (req, res) => {
  try {
    const staff = await userService.getStaffList();
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
