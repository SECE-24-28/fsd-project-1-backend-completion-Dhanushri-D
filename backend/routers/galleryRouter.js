const router = require('express').Router();
const { getAll, create, remove } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAll);
router.post('/', protect, adminOnly, create);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
