const router = require('express').Router();
const { uploadFile, deleteFile } = require('../controllers/uploadController');
const protect = require('../middleware/auth');
const { getUpload } = require('../middleware/upload');

// Dynamic middleware — picks the right multer based on UPLOAD_MODE
router.post('/', protect, (req, res, next) => {
  const upload = getUpload();
  upload.single('file')(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, uploadFile);

router.delete('/:publicId', protect, deleteFile);

module.exports = router;
