import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: String,
  specialRequests: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
