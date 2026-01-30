const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    image: { type: String },
    price: { type: Number },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    specifications: { type: Map, of: String },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
