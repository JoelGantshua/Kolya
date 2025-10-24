import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  specialRequests: String,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Reservation', reservationSchema);
