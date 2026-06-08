const BudgetPlan = require('../models/BudgetPlan');

exports.getMine = async (req, res) => {
  try {
    const plans = await BudgetPlan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const plan = await BudgetPlan.create({ ...req.body, userId: req.user.id });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const plan = await BudgetPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found.' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await BudgetPlan.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Budget plan deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
