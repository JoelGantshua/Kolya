import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Gallery', gallerySchema);
