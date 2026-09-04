import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true, trim: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    freeSeats: { type: Number, required: true, min: 0 },
    fare: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['Not Started', 'En Route', 'Arrived'],
      default: 'Not Started',
    },
    trackingActive: {
      type: Boolean,
      default: false,
    },
    currentLocation: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      updatedAt: { type: Date, default: null },
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Bus', busSchema);

