import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

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
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        to_name: 'Coal City Jacuzzi Team',
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.CONTACT_TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      // Success
      setSubmitted(true);
      setSending(false);
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('EmailJS Error:', err);
      setSending(false);
      setError('Failed to send message. Please try again or contact us directly via phone/WhatsApp.');
    }
  };

  const contactInfo = [
    {
      label: 'Visit Our Showroom',
      value: '123 Ogui Road, Enugu, Nigeria',
      sub: 'Walk-ins welcome during business hours',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      label: 'Call Us',
      value: '+234 800 COAL CITY',
      sub: 'Mon – Sat, 8AM – 6PM',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
    },
    {
      label: 'Email',
      value: 'info@coalcityplumbing.com',
      sub: 'We respond within 24 hours',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      value: '+234 801 234 5678',
      sub: 'Quick responses & product inquiries',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.66 0-3.203-.508-4.484-1.375l-.316-.188-2.869.852.852-2.869-.188-.316A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>
      ),
    },
  ];

  const hours = [
    { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM – 4:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ];

  return (
    <div className="min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-40 pb-20 bg-navy-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 40% 50%, #1e3a5f, transparent)',
          }}
        />
        <div className="absolute bottom-16 right-20 w-48 h-48 border border-gold-500/10 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-6 animate-fade-in-up">
            Get In Touch
          </span>
          <h1 className="animate-fade-in-up delay-100 font-display text-5xl sm:text-6xl font-bold text-white tracking-tight">
            Contact Us
          </h1>
          <p className="animate-fade-in-up delay-200 mt-4 text-lg text-white/50 max-w-xl">
            Have a question, need a quote, or want to visit our showroom? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ═══════════════ CONTACT CONTENT ═══════════════ */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form — 3 cols */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-cream-200/50 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
                <div className="p-8 sm:p-10">
                  <h2 className="font-display text-2xl font-bold text-navy-900 tracking-tight">
                    Send Us a Message
                  </h2>
                  <p className="mt-2 text-sm text-navy-600/60">
                    Fill out the form below and our team will get back to you promptly.
                  </p>

                  {submitted ? (
                    <div className="mt-10 text-center py-12 animate-fade-in-up">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="font-display text-xl font-bold text-navy-900">Message Sent!</h3>
                      <p className="mt-2 text-sm text-navy-600/60">
                        Thank you for reaching out. We'll respond within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200"
                            placeholder="+234 800 000 0000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Email Address *</label>
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
                        <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Subject *</label>
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200"
                          placeholder="How can we help?"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Message *</label>
                        <textarea
                          name="message"
                          rows={5}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200 resize-none"
                          placeholder="Tell us more about your project or inquiry..."
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
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950 font-semibold text-sm tracking-wide hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {sending ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar — 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact cards */}
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="p-6 bg-white rounded-2xl shadow-sm border border-cream-200/50 hover:border-gold-500/20 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400/10 to-gold-600/10 border border-gold-500/15 flex items-center justify-center text-gold-600 shrink-0 group-hover:from-gold-400/20 group-hover:to-gold-600/20 transition-colors">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-500/60 mb-1">{info.label}</h4>
                      <p className="text-sm font-semibold text-navy-900">{info.value}</p>
                      <p className="text-xs text-navy-600/50 mt-0.5">{info.sub}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Business Hours */}
              <div className="p-6 bg-navy-900 rounded-2xl text-white">
                <h4 className="font-display text-lg font-bold mb-4">Business Hours</h4>
                <div className="space-y-3">
                  {hours.map((h) => (
                    <div key={h.day} className="flex items-center justify-between">
                      <span className="text-sm text-white/60">{h.day}</span>
                      <span className={`text-sm font-medium ${h.time === 'Closed' ? 'text-red-400/80' : 'text-gold-400'}`}>
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40">
                    Holiday hours may vary. Please call ahead for confirmation.
                  </p>
                </div>
              </div>

              {/* Map placeholder */}
              <div
                className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm relative"
                style={{
                  background: 'linear-gradient(135deg, #1e3a5f, #0f2035)',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <p className="font-display text-white/30 text-sm italic">Map View</p>
                    <p className="text-white/15 text-xs mt-1">123 Ogui Road, Enugu</p>
                  </div>
                </div>
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
