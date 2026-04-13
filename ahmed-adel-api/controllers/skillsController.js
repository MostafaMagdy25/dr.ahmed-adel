const Skill = require('../models/Skill');

// @desc    Get all skill categories
// @route   GET /api/skills
// @access  Public
exports.getAll = async (req, res, next) => {
  try {
    const items = await Skill.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill category
// @route   GET /api/skills/:id
// @access  Public
exports.getOne = async (req, res, next) => {
  try {
    const item = await Skill.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Skill category not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create skill category
// @route   POST /api/skills
// @access  Private
exports.create = async (req, res, next) => {
  try {
    const count = await Skill.countDocuments();
    req.body.order = count;

    const item = await Skill.create(req.body);
    console.log(`✅ POST /api/skills — Created: "${item.title}" (${item._id})`);
    res.status(201).json({ success: true, data: item, message: 'Skill category created' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill category
// @route   PUT /api/skills/:id
// @access  Private
exports.update = async (req, res, next) => {
  try {
    const item = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Skill category not found' });
    }

    console.log(`✅ PUT /api/skills/${req.params.id} — Updated: "${item.title}"`);
    res.json({ success: true, data: item, message: 'Skill category updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill category
// @route   DELETE /api/skills/:id
// @access  Private
exports.remove = async (req, res, next) => {
  try {
    const item = await Skill.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Skill category not found' });
    }
    console.log(`🗑️  DELETE /api/skills/${req.params.id} — Deleted: "${item.title}"`);
    res.json({ success: true, message: 'Skill category deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder skill categories
// @route   PUT /api/skills/reorder
// @access  Private
exports.reorder = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array' });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { order: index } },
    }));

    await Skill.bulkWrite(bulkOps);
    const items = await Skill.find().sort({ order: 1 });
    res.json({ success: true, data: items, message: 'Items reordered' });
  } catch (error) {
    next(error);
  }
};
