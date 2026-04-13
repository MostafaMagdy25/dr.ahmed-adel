const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
  {
    tagline:      { type: String, default: '' },
    headline:     { type: String, default: '' },
    description:  { type: String, default: '' },
    primaryBtn:   { type: String, default: 'View My Work' },
    secondaryBtn: { type: String, default: 'Download Resume' },
    badgeNum:     { type: String, default: '' },
    badgeText:    { type: String, default: '' },
    badgeSubtext: { type: String, default: '' },
    imageUrl:     { type: String, default: '' },
    cvUrl:        { type: String, default: '' },
  },
  { timestamps: true }
);

// Singleton pattern — always return the single document
heroSchema.statics.getInstance = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('Hero', heroSchema);
