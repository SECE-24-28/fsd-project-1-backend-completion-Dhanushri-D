const mongoose = require('mongoose');

const budgetPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  transport: { type: Number, default: 0 },
  hotel: { type: Number, default: 0 },
  food: { type: Number, default: 0 },
  activity: { type: Number, default: 0 },
  misc: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('BudgetPlan', budgetPlanSchema);
