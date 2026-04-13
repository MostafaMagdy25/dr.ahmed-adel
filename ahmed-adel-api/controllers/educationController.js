const Education = require('../models/Education');

// @desc    Get all education items
// @route   GET /api/education
// @access  Public
exports.getAll = async (req, res, next) => {
  try {
    const items = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single education item
// @route   GET /api/education/:id
// @access  Public
exports.getOne = async (req, res, next) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Education item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create education item
// @route   POST /api/education
// @access  Private
exports.create = async (req, res, next) => {
  try {
    // Set order to last position
    const count = await Education.countDocuments();
    req.body.order = count;

    const item = await Education.create(req.body);
    console.log(`✅ POST /api/education — Created: "${item.degree}" (${item._id})`);
    res.status(201).json({ success: true, data: item, message: 'Education item created' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update education item
// @route   PUT /api/education/:id
// @access  Private
exports.update = async (req, res, next) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Education item not found' });
    }

    console.log(`✅ PUT /api/education/${req.params.id} — Updated: "${item.degree}"`);
    res.json({ success: true, data: item, message: 'Education item updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete education item
// @route   DELETE /api/education/:id
// @access  Private
exports.remove = async (req, res, next) => {
  try {
    const item = await Education.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Education item not found' });
    }
    console.log(`🗑️  DELETE /api/education/${req.params.id} — Deleted: "${item.degree}"`);
    res.json({ success: true, message: 'Education item deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder education items
// @route   PUT /api/education/reorder
// @access  Private
exports.reorder = async (req, res, next) => {
  try {
    const { orderedIds } = req.body; // Array of IDs in desired order
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array' });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index },
      },
    }));

    await Education.bulkWrite(bulkOps);
    const items = await Education.find().sort({ order: 1 });
    res.json({ success: true, data: items, message: 'Items reordered' });
  } catch (error) {
    next(error);
  }
};
