const router = require('express').Router();
const {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/messageController');
const protect = require('../middleware/auth');

// Public route to submit messages
router.post('/', createMessage);

// Protected routes to manage messages
router.get('/', protect, getMessages);
router.patch('/:id/read', protect, updateMessageStatus);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
