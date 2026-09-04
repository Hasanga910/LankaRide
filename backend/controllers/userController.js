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

export const getMyProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id || req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to load profile',
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, email, contact } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!contact || !contact.trim()) {
      return res.status(400).json({ message: 'Contact number is required' });
    }
    if (!/^\d{10}$/.test(contact.trim())) {
      return res.status(400).json({ message: 'Contact number must be exactly 10 digits' });
    }

    // Email cannot be changed after account creation
    if (email && req.user?.email && email.toLowerCase().trim() !== req.user.email.toLowerCase().trim()) {
      return res.status(400).json({ message: 'Email address cannot be changed after account creation' });
    }

    const updatedUser = await userService.updateMyProfile(req.user._id || req.user.id, {
      name,
      contact,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      contact: updatedUser.contact,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Unable to update profile',
    });
  }
};

export const deleteMyAccount = async (req, res) => {
  try {
    if (req.user.role !== 'passenger') {
      return res.status(403).json({
        message: 'This action is available to passengers only.',
      });
    }

    await userService.deleteUser(req.user._id || req.user.id);

    res.json({
      message: 'Your account has been deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to delete account.',
    });
  }
};

