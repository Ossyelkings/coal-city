import React, { useState, useEffect } from 'react';
import companyService from '../../services/companyService';

const defaultHours = [
  { day: 'Monday', open: '08:00', close: '18:00', closed: false },
  { day: 'Tuesday', open: '08:00', close: '18:00', closed: false },
  { day: 'Wednesday', open: '08:00', close: '18:00', closed: false },
  { day: 'Thursday', open: '08:00', close: '18:00', closed: false },
  { day: 'Friday', open: '08:00', close: '18:00', closed: false },
  { day: 'Saturday', open: '09:00', close: '16:00', closed: false },
  { day: 'Sunday', open: '', close: '', closed: true },
];

export default function Settings() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mission: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    foundedYear: 2009,
    socialLinks: { facebook: '', instagram: '', twitter: '' },
    businessHours: defaultHours,
    stats: { years: '', clients: '', products: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    companyService.get()
      .then((res) => {
        if (res.data) {
          const c = res.data;
          setFormData({
            name: c.name || '',
            description: c.description || '',
            mission: c.mission || '',
            address: c.address || '',
            phone: c.phone || '',
            email: c.email || '',
            whatsapp: c.whatsapp || '',
            foundedYear: c.foundedYear || 2009,
            socialLinks: {
              facebook: c.socialLinks?.facebook || '',
              instagram: c.socialLinks?.instagram || '',
              twitter: c.socialLinks?.twitter || '',
            },
            businessHours: c.businessHours?.length ? c.businessHours : defaultHours,
            stats: {
              years: c.stats?.years || '',
              clients: c.stats?.clients || '',
              products: c.stats?.products || '',
            },
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'foundedYear' ? Number(value) : value }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleStatChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      stats: { ...prev.stats, [key]: value },
    }));
  };

  const handleHoursChange = (index, field, value) => {
    setFormData((prev) => {
      const hours = [...prev.businessHours];
      hours[index] = { ...hours[index], [field]: field === 'closed' ? value : value };
      return { ...prev, businessHours: hours };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await companyService.update(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save settings';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-cream-200 rounded w-48" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 bg-cream-200 rounded-xl" />
        ))}
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all';
  const labelClass = 'block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider';

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-navy-900 tracking-tight mb-2">Company Settings</h1>
      <p className="text-sm text-navy-500/60 mb-8">Manage your company info, contact details, and social links.</p>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* General Info */}
        <section>
          <h2 className="font-display text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gold-500" />
            General Information
          </h2>
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-cream-200/80 shadow-sm">
            <div>
              <label className={labelClass}>Company Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Coal City Jacuzzi & Plumbing Supplies" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Founded Year</label>
                <input type="number" name="foundedYear" value={formData.foundedYear} onChange={handleChange} className={inputClass} min="1900" max="2099" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className={inputClass + ' resize-none'} placeholder="Company description..." />
            </div>
            <div>
              <label className={labelClass}>Mission Statement</label>
              <textarea name="mission" rows={2} value={formData.mission} onChange={handleChange} className={inputClass + ' resize-none'} placeholder="Our mission is..." />
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section>
          <h2 className="font-display text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gold-500" />
            Contact Details
          </h2>
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-cream-200/80 shadow-sm">
            <div>
              <label className={labelClass}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="123 Ogui Road, Enugu, Nigeria" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+234 800 000 0000" />
              </div>
              <div>
                <label className={labelClass}>WhatsApp</label>
                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={inputClass} placeholder="+234 800 000 0000" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="info@coalcityplumbing.com" />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section>
          <h2 className="font-display text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gold-500" />
            Social Links
          </h2>
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-cream-200/80 shadow-sm">
            {['facebook', 'instagram', 'twitter'].map((platform) => (
              <div key={platform}>
                <label className={labelClass}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                <input
                  type="url"
                  value={formData.socialLinks[platform]}
                  onChange={(e) => handleSocialChange(platform, e.target.value)}
                  className={inputClass}
                  placeholder={`https://${platform}.com/...`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Display Stats */}
        <section>
          <h2 className="font-display text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gold-500" />
            Display Stats
          </h2>
          <p className="text-xs text-navy-500/50 mb-3">These are shown on the homepage. Use values like "15+", "2,000+", etc.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-cream-200/80 shadow-sm">
            <div>
              <label className={labelClass}>Years in Business</label>
              <input type="text" value={formData.stats.years} onChange={(e) => handleStatChange('years', e.target.value)} className={inputClass} placeholder="15+" />
            </div>
            <div>
              <label className={labelClass}>Happy Clients</label>
              <input type="text" value={formData.stats.clients} onChange={(e) => handleStatChange('clients', e.target.value)} className={inputClass} placeholder="2,000+" />
            </div>
            <div>
              <label className={labelClass}>Products</label>
              <input type="text" value={formData.stats.products} onChange={(e) => handleStatChange('products', e.target.value)} className={inputClass} placeholder="500+" />
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section>
          <h2 className="font-display text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gold-500" />
            Business Hours
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-cream-200/80 shadow-sm space-y-3">
            {formData.businessHours.map((h, i) => (
              <div key={h.day} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <span className="w-24 text-sm font-medium text-navy-800 shrink-0">{h.day}</span>
                <label className="flex items-center gap-2 shrink-0">
                  <input
                    type="checkbox"
                    checked={h.closed}
                    onChange={(e) => handleHoursChange(i, 'closed', e.target.checked)}
                    className="w-4 h-4 rounded border-cream-300 text-gold-500 focus:ring-gold-500/30"
                  />
                  <span className="text-xs text-navy-600/60">Closed</span>
                </label>
                {!h.closed && (
                  <>
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => handleHoursChange(i, 'open', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-cream-200 bg-cream-50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                    />
                    <span className="text-navy-400 text-xs">to</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => handleHoursChange(i, 'close', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-cream-200 bg-cream-50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Feedback */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
            Settings saved successfully.
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
