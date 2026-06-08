const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: Number,
  title: String,
  activities: String,
});

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  includes: [String],
  itinerary: [itineraryDaySchema],
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
