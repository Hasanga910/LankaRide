import User from '../models/User.js';

// Only an Admin can create Driver/Conductor accounts — see routes/userRoutes.js
export const registerStaff = async ({ name, email, password, role, nic, contact, licenseNo }) => {
  if (!['driver', 'conductor'].includes(role)) {
    const error = new Error('Role must be either "driver" or "conductor"');
    error.statusCode = 400;
    throw error;
  }

  const existsEmail = await User.findOne({ email });
  if (existsEmail) {
    const error = new Error('This email is already registered');
    error.statusCode = 400;
    throw error;
  }

  if (nic) {
    const existsNic = await User.findOne({ nic });
    if (existsNic) {
      const error = new Error('A staff member with this NIC/ID already exists');
      error.statusCode = 400;
      throw error;
    }
  }

  const user = await User.create({ name, email, password, role, nic, contact, licenseNo });
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    nic: user.nic,
    contact: user.contact,
    licenseNo: user.licenseNo,
  };
};

export const getStaffList = async () =>
  User.find({ role: { $in: ['driver', 'conductor'] } }).select('-password').sort({ createdAt: -1 });
