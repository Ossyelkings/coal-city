const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../utils/sendEmail');

// POST /api/contacts
exports.submit = async (req, res, next) => {
  try {
    const message = await ContactMessage.create(req.body);

    // Send notification email (non-blocking)
    sendEmail({
      to: process.env.EMAIL_FROM,
      subject: `New Contact: ${message.subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Phone:</strong> ${message.phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong> ${message.message}</p>
      `,
    }).catch((err) => console.error('Contact notification email failed:', err.message));

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

// GET /api/contacts
exports.list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [messages, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContactMessage.countDocuments(filter),
    ]);

    res.json({
      messages,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/contacts/:id
exports.getById = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        error: { message: 'Message not found', code: 'NOT_FOUND' },
      });
    }
    res.json(message);
  } catch (err) {
    next(err);
  }
};

// PUT /api/contacts/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const update = { status };
    if (notes !== undefined) update.notes = notes;

    const message = await ContactMessage.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!message) {
      return res.status(404).json({
        error: { message: 'Message not found', code: 'NOT_FOUND' },
      });
    }
    res.json(message);
  } catch (err) {
    next(err);
  }
};
