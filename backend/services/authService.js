import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  return { token: generateToken(user._id), user: toPublicUser(user) };
};

// Anyone can self-register as a Passenger — Admin only needs to onboard
// Drivers and Conductors (see userService.registerStaff).
export const registerPassenger = async ({ name, email, password, contact }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    const error = new Error('This email is already registered');
    error.statusCode = 400;
    throw error;
  }
  const user = await User.create({ name, email, password, contact, role: 'passenger' });
  return { token: generateToken(user._id), user: toPublicUser(user) };
};
