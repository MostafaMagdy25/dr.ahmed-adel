const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    email:    { type: String, default: '' },
    phone:    { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github:   { type: String, default: '' },
    twitter:  { type: String, default: '' },
    facebook: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    address:  { type: String, default: '' },
  },
  { timestamps: true }
);

contactSchema.statics.getInstance = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('Contact', contactSchema);
