const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: String, required: true },
  type: { type: String, enum: ['package', 'hotel', 'trip'], required: true },
  title: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  destination: { type: String, default: '' },
  duration: { type: String, default: '' },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  cancelledAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
