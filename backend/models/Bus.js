import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true, trim: true },
    route: { type: String, required: true, trim: true },
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
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Bus', busSchema);
