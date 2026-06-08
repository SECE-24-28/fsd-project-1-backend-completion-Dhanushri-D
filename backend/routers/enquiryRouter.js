const router = require('express').Router();
const { getAll, getMyEnquiries, create, updateStatus, remove } = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAll);
router.get('/mine', protect, getMyEnquiries);
router.post('/', protect, create);
router.put('/:id', protect, adminOnly, updateStatus);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
