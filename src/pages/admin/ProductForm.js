import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import api from '../../services/api';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    featured: false,
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    categoryService.list()
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    productService.getById(id)
      .then((res) => {
        const p = res.data;
        setFormData({
          name: p.name || '',
          description: p.description || '',
          category: typeof p.category === 'object' ? p.category._id : p.category || '',
          image: p.image || '',
          featured: p.featured || false,
        });
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEdit) {
        await productService.update(id, formData);
      } else {
        await productService.create(formData);
      }
      navigate('/admin/products');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save product';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-cream-200 rounded w-48" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-cream-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-sm text-navy-500/60 hover:text-navy-700 transition-colors mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Products
      </button>

      <h1 className="font-display text-2xl font-bold text-navy-900 tracking-tight mb-8">
        {isEdit ? 'Edit Product' : 'New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Product Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
            placeholder="e.g. Serenity Pro Jacuzzi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Category *</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all resize-none"
            placeholder="Describe the product..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Image</label>
          <div className="space-y-3">
            {formData.image && (
              <div className="w-full h-48 rounded-xl overflow-hidden bg-cream-100 border border-cream-200">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex gap-3">
              <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-cream-300 text-sm text-navy-500/60 cursor-pointer hover:border-gold-500/30 hover:text-gold-600 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="or paste image URL"
                className="flex-1 px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded border-cream-300 text-gold-500 focus:ring-gold-500/30"
          />
          <label htmlFor="featured" className="text-sm text-navy-700 font-medium cursor-pointer">
            Featured product (shown on homepage)
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="flex-1 py-3 rounded-xl border border-cream-200 text-sm font-medium text-navy-700 hover:bg-cream-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
