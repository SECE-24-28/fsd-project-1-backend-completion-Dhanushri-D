const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMine, addItem, removeItem } = require('../controllers/wishlistController');

router.get('/', protect, getMine);
router.post('/', protect, addItem);
router.delete('/:itemId/:itemType', protect, removeItem);

module.exports = router;
