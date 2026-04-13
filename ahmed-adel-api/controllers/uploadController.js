const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// @desc    Upload a file
// @route   POST /api/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      console.warn('⚠️  Upload attempt with no file');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log(`📁 Upload request received: ${req.file.originalname} (${req.file.mimetype}) - ${Math.round(req.file.size / 1024)} KB`);

    if (process.env.UPLOAD_MODE === 'cloudinary') {
      // Upload to Cloudinary from memory buffer
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'ahmed-portfolio',
            resource_type: 'auto', // 'auto' supports both images and generic files like PDFs
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      return res.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        },
        message: 'File uploaded to Cloudinary',
      });
    }

    // Local storage — file already saved by multer disk storage
    console.log(`✅  Local file saved successfully at uploads/${req.file.filename}`);
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      data: {
        url: fileUrl,
        publicId: req.file.filename,
        filename: req.file.filename,
        bytes: req.file.size,
      },
      message: 'File uploaded locally',
    });
  } catch (error) {
    console.error(`❌ Upload failed: ${error.message}`);
    next(error);
  }
};

// @desc    Delete an uploaded file
// @route   DELETE /api/upload/:publicId
// @access  Private
exports.deleteFile = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    if (process.env.UPLOAD_MODE === 'cloudinary') {
      await cloudinary.uploader.destroy(publicId);
      return res.json({ success: true, message: 'File deleted from Cloudinary' });
    }

    // Local deletion
    const filePath = path.join(__dirname, '..', 'uploads', publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    next(error);
  }
};
