const TripPlan = require('../models/TripPlan');

exports.getMine = async (req, res) => {
  try {
    const plans = await TripPlan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const plan = await TripPlan.create({ ...req.body, userId: req.user.id });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await TripPlan.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Trip plan deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
