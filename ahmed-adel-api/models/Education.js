const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree:      { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    date:        { type: String, default: '' },
    description: { type: String, default: '' },
    highlights:  [{ type: String }],
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

educationSchema.index({ order: 1 });

module.exports = mongoose.model('Education', educationSchema);
