const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  destination: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Read', 'Replied'], default: 'New' },
  itemId: { type: String, default: '' },
  itemTitle: { type: String, default: '' },
  itemType: { type: String, default: '' },
  itemPrice: { type: Number },
  enquiryType: { type: String, default: '' },
  travelDate: { type: String, default: '' },
  groupSize: { type: String, default: '1' },
  adminReply: { type: String, default: '' },
  repliedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
