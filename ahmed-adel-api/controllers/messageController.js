const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// Helper to send email notification
const sendNotificationEmail = async (message) => {
  try {
    // Only attempt to send if SMTP settings are provided
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.NOTIFICATION_EMAIL) {
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Message: ${message.subject}`,
      text: `You have received a new message from your portfolio website.\n\nName: ${message.name}\nEmail: ${message.email}\nSubject: ${message.subject}\n\nMessage:\n${message.message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${message.email}">${message.email}</a></p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message.message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw error to client if email fails, message was still saved!
  }
};

// @desc    Submit a new message
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    // Fire & forget email sending (don't await so user isn't blocked)
    sendNotificationEmail(newMessage);

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages (with pagination, search, filters)
// @route   GET /api/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by read status
    if (req.query.isRead !== undefined) {
      query.isRead = req.query.isRead === 'true';
    }

    // Search by name or email
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex }
      ];
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read/unread
// @route   PATCH /api/messages/:id/read
// @access  Private
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { isRead } = req.body;

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
