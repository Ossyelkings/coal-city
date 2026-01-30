const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    product: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'contacted', 'quoted', 'closed'],
      default: 'new',
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

quoteSchema.index({ status: 1 });
quoteSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Quote', quoteSchema);
