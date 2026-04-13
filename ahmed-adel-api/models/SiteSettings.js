const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    sectionsVisibility: {
      hero:           { type: Boolean, default: true },
      about:          { type: Boolean, default: true },
      education:      { type: Boolean, default: true },
      skills:         { type: Boolean, default: true },
      projects:       { type: Boolean, default: true },
      certifications: { type: Boolean, default: true },
      volunteering:   { type: Boolean, default: true },
      contact:        { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

siteSettingsSchema.statics.getInstance = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
