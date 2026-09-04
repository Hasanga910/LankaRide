import User from '../models/User.js';

// Ensures exactly one Admin account always exists, created from environment
// variables. Runs on every server start — if the admin already exists (by
// email), it does nothing. This means you never have to remember to run a
// separate seed script just to get an Admin login working.
export const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      'ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin bootstrap. ' +
        'Add them to backend/.env to auto-create an admin account.'
    );
    return;
  }

  const existing = await User.findOne({ email });

  if (existing) {
    // Keep the password in sync with .env in case you changed it there.
    existing.password = password; // re-hashed by the pre('save') hook
    existing.role = 'admin';
    await existing.save();
    console.log(`Admin account ready: ${email}`);
    return;
  }

  await User.create({
    name: process.env.ADMIN_NAME || 'System Admin',
    email,
    password,
    role: 'admin',
  });
  console.log(`Admin account created: ${email}`);
};