const router = require('express').Router();
const { getAll, getOne, create, update, remove, reorder } = require('../controllers/educationController');
const protect = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', protect, create);
router.put('/reorder', protect, reorder);  // Must be before :id route
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
