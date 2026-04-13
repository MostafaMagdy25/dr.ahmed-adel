const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    title:  { type: String, required: true, trim: true },
    skills: [{ type: String }],
    order:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

skillSchema.index({ order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
