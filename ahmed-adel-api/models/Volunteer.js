const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    organization: { type: String, default: '' },
    date:         { type: String, default: '' },
    location:     { type: String, default: '' },
    description:  { type: String, default: '' },
    color:        { type: String, default: 'bg-blue-50 border-blue-100 text-blue-500' },
    order:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

volunteerSchema.index({ order: 1 });

module.exports = mongoose.model('Volunteer', volunteerSchema);
