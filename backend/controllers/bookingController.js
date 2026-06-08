const Booking = require('../models/Booking');

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id });
  res.json(bookings);
};

exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate('userId', 'name email');
  res.json(bookings);
};

exports.create = async (req, res) => {
  const existing = await Booking.findOne({ userId: req.user.id, itemId: req.body.itemId, type: req.body.type, status: 'confirmed' });
  if (existing) return res.status(400).json({ message: 'Already booked.' });
  const booking = await Booking.create({ ...req.body, userId: req.user.id });
  res.status(201).json(booking);
};

exports.cancel = async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { status: 'cancelled', cancelledAt: new Date() },
    { new: true }
  );
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  res.json(booking);
};

exports.complete = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'completed', completedAt: new Date() }, { new: true });
  res.json(booking);
};

exports.remove = async (req, res) => {
  await Booking.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Booking deleted.' });
};
