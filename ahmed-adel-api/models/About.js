const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
  {
    introText:  { type: String, default: '' },
    journeyP1:  { type: String, default: '' },
    journeyP2:  { type: String, default: '' },
  },
  { timestamps: true }
);

aboutSchema.statics.getInstance = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('About', aboutSchema);
