import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  ingredients: [String],
  isVegetarian: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false }
});

export default mongoose.model('Dish', dishSchema);
