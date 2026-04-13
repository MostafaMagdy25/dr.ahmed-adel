const router = require('express').Router();
const { getHero, updateHero } = require('../controllers/heroController');
const protect = require('../middleware/auth');

router.get('/', getHero);
router.put('/', protect, updateHero);

module.exports = router;
