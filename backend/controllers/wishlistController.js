const Wishlist = require('../models/Wishlist');

exports.getMine = async (req, res) => {
  try {
    const doc = await Wishlist.findOne({ userId: req.user.id });
    res.json(doc ? doc.items : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const item = { ...req.body, addedAt: new Date() };
    const doc = await Wishlist.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { items: item } },
      { upsert: true, new: true }
    );
    res.json(doc.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const doc = await Wishlist.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { items: { id: itemId, itemType } } },
      { new: true }
    );
    res.json(doc ? doc.items : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
