const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Coal City Jacuzzi & Plumbing Supplies' },
    tagline: { type: String },
    description: { type: String },
    mission: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    whatsapp: { type: String },
    foundedYear: { type: Number },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },
    businessHours: [
      {
        day: { type: String },
        time: { type: String },
      },
    ],
    stats: {
      products: { type: String },
      clients: { type: String },
      years: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanyInfo', companyInfoSchema);
