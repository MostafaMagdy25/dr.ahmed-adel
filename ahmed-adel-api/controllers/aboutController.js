const About = require('../models/About');

// @desc    Get about content
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res, next) => {
  try {
    const about = await About.getInstance();
    console.log(`📖 GET /api/about — introText: ${about.introText ? about.introText.substring(0, 50) + '…' : '(empty)'}`);
    res.json({ success: true, data: about });
  } catch (error) {
    next(error);
  }
};

// @desc    Update about content
// @route   PUT /api/about
// @access  Private
exports.updateAbout = async (req, res, next) => {
  try {
    const about = await About.getInstance();
    const fields = ['introText', 'journeyP1', 'journeyP2'];

    const updatedFields = [];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        about[field] = req.body[field];
        updatedFields.push(field);
      }
    });

    await about.save();
    console.log(`✅ PUT /api/about — Updated fields: [${updatedFields.join(', ')}]`);
    res.json({ success: true, data: about, message: 'About updated successfully' });
  } catch (error) {
    console.error(`❌ PUT /api/about failed:`, error.message);
    next(error);
  }
};
