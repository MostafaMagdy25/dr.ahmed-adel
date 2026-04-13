const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    category:    { type: String, default: '' },
    date:        { type: String, default: '' },
    description: { type: String, default: '' },
    image:       { type: String, default: '' },
    role:        { type: String, default: '' },
    location:    { type: String, default: '' },
    details:     [{ type: String }],
    tags:        [{ type: String }],
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ order: 1 });

module.exports = mongoose.model('Project', projectSchema);
