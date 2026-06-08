const Enquiry = require('../models/Enquiry');

exports.getAll = async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
};

exports.getMyEnquiries = async (req, res) => {
  const enquiries = await Enquiry.find({
    $or: [{ userId: req.user.id }, { email: req.user.email }]
  }).sort({ createdAt: -1 });
  res.json(enquiries);
};

exports.create = async (req, res) => {
  const enquiry = await Enquiry.create({ ...req.body, userId: req.user.id });
  res.status(201).json(enquiry);
};

exports.updateStatus = async (req, res) => {
  const { status, adminReply } = req.body;
  const updates = { status };
  if (adminReply !== undefined) {
    updates.adminReply = adminReply;
    if (adminReply) {
      updates.repliedAt = new Date();
      updates.status = 'Replied';
    }
  }
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(enquiry);
};

exports.remove = async (req, res) => {
  await Enquiry.findByIdAndDelete(req.params.id);
  res.json({ message: 'Enquiry deleted.' });
};
