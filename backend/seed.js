// Seeds sample Admin / Driver / Conductor / Passenger accounts and sample
// buses so the app can be demoed immediately. Run with: npm run seed
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Bus from './models/Bus.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Bus.deleteMany({});

  await User.create({
    name: 'System Admin',
    email: 'admin@busbuddy.lk',
    password: 'Admin@123',
    role: 'admin',
  });

  const driver1 = await User.create({
    name: 'Nimal Perera',
    email: 'driver1@busbuddy.lk',
    password: 'Driver@123',
    role: 'driver',
    nic: '901234567V',
    contact: '0771234567',
    licenseNo: 'DL-10023',
  });

  const driver2 = await User.create({
    name: 'Sunil Fernando',
    email: 'driver2@busbuddy.lk',
    password: 'Driver@123',
    role: 'driver',
    nic: '881234567V',
    contact: '0777654321',
    licenseNo: 'DL-10098',
  });

  const conductor1 = await User.create({
    name: 'Kamal Silva',
    email: 'conductor1@busbuddy.lk',
    password: 'Conductor@123',
    role: 'conductor',
    nic: '921234567V',
    contact: '0712345678',
  });

  const conductor2 = await User.create({
    name: 'Ruwan Jayasuriya',
    email: 'conductor2@busbuddy.lk',
    password: 'Conductor@123',
    role: 'conductor',
    nic: '931234567V',
    contact: '0719876543',
  });

  await User.create({
    name: 'Sample Passenger',
    email: 'passenger@busbuddy.lk',
    password: 'Passenger@123',
    role: 'passenger',
    contact: '0701112233',
  });

  await Bus.create([
    {
      busNumber: 'NB-4521',
      from: 'Malabe',
      to: 'Colombo',
      capacity: 50,
      freeSeats: 12,
      fare: 80,
      status: 'En Route',
      trackingActive: true,
      currentLocation: {
        latitude: 6.9044,
        longitude: 79.9542,
        updatedAt: new Date(),
      },
      driver: driver1._id,
      conductor: conductor1._id,
    },
    {
      busNumber: 'NB-7788',
      from: 'Kaduwela',
      to: 'Fort',
      capacity: 45,
      freeSeats: 45,
      fare: 70,
      status: 'Not Started',
      trackingActive: false,
      currentLocation: {
        latitude: 6.9328,
        longitude: 79.9839,
        updatedAt: null,
      },
      driver: driver2._id,
      conductor: conductor2._id,
    },
    {
      busNumber: 'NB-1123',
      from: 'Kandy',
      to: 'Colombo',
      capacity: 55,
      freeSeats: 3,
      fare: 320,
      status: 'En Route',
      trackingActive: true,
      currentLocation: {
        latitude: 7.2906,
        longitude: 80.6337,
        updatedAt: new Date(),
      },
      driver: driver1._id,
      conductor: null,
    },
  ]);


  console.log('\nSeed data created. Sample logins:');
  console.log('  Admin:      admin@busbuddy.lk      / Admin@123');
  console.log('  Driver:     driver1@busbuddy.lk     / Driver@123');
  console.log('  Conductor:  conductor1@busbuddy.lk  / Conductor@123');
  console.log('  Passenger:  passenger@busbuddy.lk   / Passenger@123\n');

  await mongoose.disconnect();
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
