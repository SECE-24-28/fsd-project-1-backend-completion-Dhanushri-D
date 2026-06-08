const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: Number,
  title: String,
  activities: String,
});

const tripPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  days: { type: Number, required: true },
  budget: { type: String, default: '' },
  travelType: { type: String, default: 'Solo' },
  interests: [String],
  notes: { type: String, default: '' },
  itinerary: [itineraryDaySchema],
}, { timestamps: true });

module.exports = mongoose.model('TripPlan', tripPlanSchema);
