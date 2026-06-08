const router = require('express').Router();
const { getMine, create, update, remove } = require('../controllers/budgetPlanController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMine);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
