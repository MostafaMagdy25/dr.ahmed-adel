const router = require('express').Router();
const Hero = require('../models/Hero');
const About = require('../models/About');
const Contact = require('../models/Contact');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Volunteer = require('../models/Volunteer');
const SiteSettings = require('../models/SiteSettings');

// @desc    Get all portfolio data in a single request (public site optimization)
// @route   GET /api/portfolio
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const [hero, about, contact, education, skills, projects, volunteers, settings] = await Promise.all([
      Hero.getInstance(),
      About.getInstance(),
      Contact.getInstance(),
      Education.find().sort({ order: 1, createdAt: -1 }),
      Skill.find().sort({ order: 1, createdAt: -1 }),
      Project.find().sort({ order: 1, createdAt: -1 }),
      Volunteer.find().sort({ order: 1, createdAt: -1 }),
      SiteSettings.getInstance(),
    ]);

    res.json({
      success: true,
      data: {
        hero,
        about,
        contact,
        education,
        skills,
        projects,
        volunteers,
        sectionsVisibility: settings.sectionsVisibility,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
