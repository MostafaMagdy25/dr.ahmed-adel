const multer = require('multer');
const path = require('path');

// Allowed MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, GIF images and PDF documents are allowed'), false);
  }
};

// --- Memory storage (for Cloudinary upload) ---
const memoryStorage = multer.memoryStorage();

const uploadMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

// --- Disk storage (for local upload fallback) ---
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const uploadDisk = multer({
  storage: diskStorage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

/**
 * Returns the appropriate multer middleware based on UPLOAD_MODE env variable.
 * Usage: upload.single('image')
 */
const getUpload = () => {
  return process.env.UPLOAD_MODE === 'cloudinary' ? uploadMemory : uploadDisk;
};

module.exports = { getUpload, uploadMemory, uploadDisk };
