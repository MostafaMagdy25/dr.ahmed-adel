const Hero = require('../models/Hero');

// @desc    Get hero content
// @route   GET /api/hero
// @access  Public
exports.getHero = async (req, res, next) => {
  try {
    const hero = await Hero.getInstance();
    console.log(`📖 GET /api/hero — imageUrl: ${hero.imageUrl || '(empty)'}, cvUrl: ${hero.cvUrl || '(empty)'}`);
    res.json({ success: true, data: hero });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hero content
// @route   PUT /api/hero
// @access  Private
exports.updateHero = async (req, res, next) => {
  try {
    const hero = await Hero.getInstance();
    const fields = ['tagline', 'headline', 'description', 'primaryBtn', 'secondaryBtn', 'badgeNum', 'badgeText', 'badgeSubtext', 'imageUrl', 'cvUrl'];
    
    const updatedFields = [];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        hero[field] = req.body[field];
        updatedFields.push(field);
      }
    });

    await hero.save();
    console.log(`✅ PUT /api/hero — Updated fields: [${updatedFields.join(', ')}] | imageUrl: ${hero.imageUrl || '(empty)'} | cvUrl: ${hero.cvUrl || '(empty)'}`);
    res.json({ success: true, data: hero, message: 'Hero updated successfully' });
  } catch (error) {
    console.error(`❌ PUT /api/hero failed:`, error.message);
    next(error);
  }
};
