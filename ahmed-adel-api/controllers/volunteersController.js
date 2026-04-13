const Volunteer = require('../models/Volunteer');

// @desc    Get all volunteer items
// @route   GET /api/volunteers
// @access  Public
exports.getAll = async (req, res, next) => {
  try {
    const items = await Volunteer.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single volunteer item
// @route   GET /api/volunteers/:id
// @access  Public
exports.getOne = async (req, res, next) => {
  try {
    const item = await Volunteer.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Volunteer item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create volunteer item
// @route   POST /api/volunteers
// @access  Private
exports.create = async (req, res, next) => {
  try {
    const count = await Volunteer.countDocuments();
    req.body.order = count;

    const item = await Volunteer.create(req.body);
    console.log(`✅ POST /api/volunteers — Created: "${item.title}" (${item._id})`);
    res.status(201).json({ success: true, data: item, message: 'Volunteer item created' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update volunteer item
// @route   PUT /api/volunteers/:id
// @access  Private
exports.update = async (req, res, next) => {
  try {
    const item = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Volunteer item not found' });
    }

    console.log(`✅ PUT /api/volunteers/${req.params.id} — Updated: "${item.title}"`);
    res.json({ success: true, data: item, message: 'Volunteer item updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete volunteer item
// @route   DELETE /api/volunteers/:id
// @access  Private
exports.remove = async (req, res, next) => {
  try {
    const item = await Volunteer.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Volunteer item not found' });
    }
    console.log(`🗑️  DELETE /api/volunteers/${req.params.id} — Deleted: "${item.title}"`);
    res.json({ success: true, message: 'Volunteer item deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder volunteer items
// @route   PUT /api/volunteers/reorder
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

    await Volunteer.bulkWrite(bulkOps);
    const items = await Volunteer.find().sort({ order: 1 });
    res.json({ success: true, data: items, message: 'Items reordered' });
  } catch (error) {
    next(error);
  }
};
