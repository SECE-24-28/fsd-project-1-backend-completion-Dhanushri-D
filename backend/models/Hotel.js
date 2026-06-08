const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  type: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  amenities: [String],
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
