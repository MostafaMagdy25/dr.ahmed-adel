const Contact = require('../models/Contact');

// @desc    Get contact info
// @route   GET /api/contact
// @access  Public
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.getInstance();
    console.log(`📖 GET /api/contact — email: ${contact.email || '(empty)'}`);
    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact info
// @route   PUT /api/contact
// @access  Private
exports.updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.getInstance();
    const fields = ['email', 'phone', 'linkedin', 'github', 'twitter', 'facebook', 'whatsapp', 'address'];

    const updatedFields = [];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        contact[field] = req.body[field];
        updatedFields.push(field);
      }
    });

    await contact.save();
    console.log(`✅ PUT /api/contact — Updated fields: [${updatedFields.join(', ')}]`);
    res.json({ success: true, data: contact, message: 'Contact updated successfully' });
  } catch (error) {
    console.error(`❌ PUT /api/contact failed:`, error.message);
    next(error);
  }
};
