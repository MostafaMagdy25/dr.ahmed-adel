const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getAll = async (req, res, next) => {
  try {
    const items = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getOne = async (req, res, next) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.create = async (req, res, next) => {
  try {
    const count = await Project.countDocuments();
    req.body.order = count;

    const item = await Project.create(req.body);
    console.log(`✅ POST /api/projects — Created: "${item.title}" (${item._id}) | image: ${item.image || '(none)'}`);
    res.status(201).json({ success: true, data: item, message: 'Project created' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.update = async (req, res, next) => {
  try {
    const item = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    console.log(`✅ PUT /api/projects/${req.params.id} — Updated: "${item.title}" | image: ${item.image || '(none)'}`);
    res.json({ success: true, data: item, message: 'Project updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.remove = async (req, res, next) => {
  try {
    const item = await Project.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    console.log(`🗑️  DELETE /api/projects/${req.params.id} — Deleted: "${item.title}"`);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder projects
// @route   PUT /api/projects/reorder
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

    await Project.bulkWrite(bulkOps);
    const items = await Project.find().sort({ order: 1 });
    res.json({ success: true, data: items, message: 'Items reordered' });
  } catch (error) {
    next(error);
  }
};
