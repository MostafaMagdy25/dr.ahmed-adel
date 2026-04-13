const router = require('express').Router();
const { getContact, updateContact } = require('../controllers/contactController');
const protect = require('../middleware/auth');

router.get('/', getContact);
router.put('/', protect, updateContact);

module.exports = router;
