const Gallery = require('../models/Gallery');

exports.getAll = async (req, res) => {
  try {
    const items = await Gallery.find().populate('userId', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = await Gallery.create({ ...req.body, userId: req.user.id });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
