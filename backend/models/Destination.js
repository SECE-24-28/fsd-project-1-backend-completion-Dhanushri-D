const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  price: { type: Number, required: true },
  bestSeason: { type: String, default: '' },
  duration: { type: String, default: '' },
  highlights: [String],
  pickupPoints: [String],
  coveringPlaces: [String],
  droppingPoints: [String],
  tripHotels: [String],
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
