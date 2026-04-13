const router = require('express').Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const protect = require('../middleware/auth');

router.get('/', getAbout);
router.put('/', protect, updateAbout);

module.exports = router;
