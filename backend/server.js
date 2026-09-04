import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { ensureAdmin } from './utils/ensureAdmin.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import busRoutes from './routes/busRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'BusBuddy LK API' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/buses', busRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Basic error handler as a safety net
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then make sure the hardcoded admin account
// exists, THEN start accepting requests — avoids race conditions where a
// request hits the API before the DB connection (or the admin user) is ready.
const start = async () => {
  await connectDB();
  await ensureAdmin();
  app.listen(PORT, () => console.log(`BusBuddy LK API running on port ${PORT}`));
};

start();