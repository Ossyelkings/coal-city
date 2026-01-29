import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

const productOptions = [
  'Jacuzzi / Hot Tub',
  'Bathtub',
  'Sink / Basin',
  'Water Closet / Toilet',
  'Pipes',
  'Fittings & Connectors',
  'Valves',
  'Full Bathroom Setup',
  'Other',
];

export default function QuoteModal({ isOpen, onClose, preselectedProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    if (preselectedProduct) {
      setFormData(prev => ({ ...prev, product: preselectedProduct }));
    }
  }, [preselectedProduct]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      // Send email via EmailJS
      const templateParams = {
        name: formData.name,
        email: formData.email,
        title: `Quote Request – ${formData.product}`,
        message: `Phone: ${formData.phone}\nProduct: ${formData.product}\n\n${formData.message}`,
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.QUOTE_TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      // Success
      setSubmitted(true);
      setSending(false);
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', product: '', message: '' });
        onClose();
        setSubmitted(false);
      }, 2500);
    } catch (err) {
      console.error('EmailJS Error:', err);
      setSending(false);
      setError('Failed to send request. Please try again or contact us directly.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
      >
        {/* Gold accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

        {/* Header */}
        <div className="relative px-8 pt-8 pb-4">
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-5"
            style={{
              background: 'radial-gradient(circle at top right, #d4a853, transparent 70%)',
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center transition-colors duration-200 text-navy-700"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l10 10M14 4L4 14" />
            </svg>
          </button>
          <h2 className="font-display text-2xl font-bold text-navy-900 tracking-tight">
            Request a Quote
          </h2>
          <p className="mt-1 text-sm text-navy-600/70 font-body">
            Tell us what you need and we'll get back to you within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div className="px-8 pb-10 pt-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-navy-900">Thank You!</h3>
            <p className="mt-2 text-navy-600/70 text-sm">
              We've received your request. Our team will reach out shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">
                Product Interest *
              </label>
              <select
                name="product"
                required
                value={formData.product}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%231e3a5f' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                }}
              >
                <option value="">Select a product category</option>
                {productOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">
                Message
              </label>
              <textarea
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200 resize-none"
                placeholder="Tell us about your project or specific requirements..."
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950 font-semibold text-sm tracking-wide hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {sending ? 'Sending...' : 'Submit Quote Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
