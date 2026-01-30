const Quote = require('../models/Quote');
const sendEmail = require('../utils/sendEmail');

// POST /api/quotes
exports.submit = async (req, res, next) => {
  try {
    const data = { ...req.body };

    // Associate with logged-in user if available
    if (req.user) {
      data.user = req.user._id;
    }

    const quote = await Quote.create(data);

    // Send notification email (non-blocking)
    sendEmail({
      to: process.env.EMAIL_FROM,
      subject: `New Quote Request: ${quote.product}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${quote.name}</p>
        <p><strong>Email:</strong> ${quote.email}</p>
        <p><strong>Phone:</strong> ${quote.phone}</p>
        <p><strong>Product:</strong> ${quote.product}</p>
        <p><strong>Message:</strong> ${quote.message || 'N/A'}</p>
      `,
    }).catch((err) => console.error('Quote notification email failed:', err.message));

    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
};

// GET /api/quotes
exports.list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [quotes, total] = await Promise.all([
      Quote.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Quote.countDocuments(filter),
    ]);

    res.json({
      quotes,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/quotes/:id
exports.getById = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('user', 'name email');
    if (!quote) {
      return res.status(404).json({
        error: { message: 'Quote not found', code: 'NOT_FOUND' },
      });
    }
    res.json(quote);
  } catch (err) {
    next(err);
  }
};

// PUT /api/quotes/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const update = { status };
    if (notes !== undefined) update.notes = notes;

    const quote = await Quote.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!quote) {
      return res.status(404).json({
        error: { message: 'Quote not found', code: 'NOT_FOUND' },
      });
    }
    res.json(quote);
  } catch (err) {
    next(err);
  }
};

// GET /api/quotes/my
exports.myQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    next(err);
  }
};
