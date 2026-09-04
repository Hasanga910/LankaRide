import * as userService from '../services/userService.js';

export const registerStaff = async (req, res) => {
  try {
    const { name, email, password, role, nic, contact, licenseNo } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
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
