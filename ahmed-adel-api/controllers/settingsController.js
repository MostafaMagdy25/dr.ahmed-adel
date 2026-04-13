const SiteSettings = require('../models/SiteSettings');

// @desc    Get site settings (section visibility)
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.getInstance();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.getInstance();

    if (req.body.sectionsVisibility) {
      const vis = req.body.sectionsVisibility;
      const allowed = ['hero', 'about', 'education', 'skills', 'projects', 'certifications', 'volunteering', 'contact'];

      allowed.forEach((key) => {
        if (vis[key] !== undefined) {
          settings.sectionsVisibility[key] = vis[key];
        }
      });

      settings.markModified('sectionsVisibility');
    }

    await settings.save();
    res.json({ success: true, data: settings, message: 'Settings updated' });
  } catch (error) {
    next(error);
  }
};
