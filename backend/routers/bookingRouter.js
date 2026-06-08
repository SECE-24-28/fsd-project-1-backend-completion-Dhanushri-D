const router = require('express').Router();
const { getMyBookings, getAllBookings, create, cancel, complete, remove } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getMyBookings);
router.get('/all', protect, adminOnly, getAllBookings);
router.post('/', protect, create);
router.put('/:id/cancel', protect, cancel);
router.put('/:id/complete', protect, adminOnly, complete);
router.delete('/:id', protect, remove);

module.exports = router;
