const router = require('express').Router();
const { getMine, create, remove } = require('../controllers/tripPlanController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMine);
router.post('/', protect, create);
router.delete('/:id', protect, remove);

module.exports = router;
