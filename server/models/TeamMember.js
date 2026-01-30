const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    image: { type: String },
    bio: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

teamMemberSchema.index({ order: 1 });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
