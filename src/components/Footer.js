import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import companyService from '../services/companyService';
import categoryService from '../services/categoryService';

const fallbackProducts = ['Jacuzzis & Hot Tubs', 'Bathtubs', 'Sinks & Basins', 'Water Closets', 'Pipes & Fittings', 'Valves'];

const fallbackContact = {
  address: '123 Ogui Road, Enugu, Nigeria',
  phone: '+234 800 COAL CITY',
  email: 'info@coalcityplumbing.com',
};

const fallbackSocials = [
  { platform: 'facebook', url: '#facebook' },
  { platform: 'instagram', url: '#instagram' },
  { platform: 'twitter', url: '#twitter' },
];

export default function Footer() {
  const [products, setProducts] = useState(fallbackProducts);
  const [contact, setContact] = useState(fallbackContact);
  const [socials, setSocials] = useState(fallbackSocials);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, catRes] = await Promise.all([
          companyService.get().catch(() => null),
          categoryService.list().catch(() => null),
        ]);

        if (compRes?.data) {
          const c = compRes.data;
          setContact({
            address: c.address || fallbackContact.address,
            phone: c.phone || fallbackContact.phone,
            email: c.email || fallbackContact.email,
          });
          if (c.socialLinks) {
            const mapped = Object.entries(c.socialLinks)
              .filter(([, url]) => url)
              .map(([platform, url]) => ({ platform, url }));
            if (mapped.length) setSocials(mapped);
          }
        }

        if (catRes?.data?.length) {
          setProducts(catRes.data.map((c) => c.name));
        }
      } catch {
        // fallbacks already set
      }
    };
    fetchData();
  }, []);

  const addressParts = contact.address.split(',').map((s) => s.trim());

  return (
    <footer className="relative bg-navy-950 text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gold-500/5 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6 2 10c0 2.5 1.5 4.5 3 6v4l3-2c1.2.6 2.6 1 4 1s2.8-.4 4-1l3 2v-4c1.5-1.5 3-3.5 3-6 0-4-4.48-8-10-8z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
              </div>
              <div>
                <div className="font-display text-lg font-bold leading-tight">Coal City</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold-400 font-semibold">
                  Jacuzzi & Plumbing
                </div>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Your trusted source for premium bathroom fixtures and professional plumbing supplies in Enugu and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/gallery', label: 'Product Gallery' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/50 hover:text-gold-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold-500/40 group-hover:bg-gold-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400 mb-5">
              Our Products
            </h4>
            <ul className="space-y-3">
              {products.map(item => (
                <li key={item}>
                  <Link
                    to="/gallery"
                    className="text-sm text-white/50 hover:text-gold-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold-500/40 group-hover:bg-gold-400 transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400 mb-5">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  {addressParts.map((part, i) => (
                    <p key={i} className="text-sm text-white/70">{part}{i < addressParts.length - 1 ? ',' : ''}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <p className="text-sm text-white/70">{contact.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <p className="text-sm text-white/70">{contact.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Coal City Jacuzzi & Plumbing Supplies. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ platform, url }) => (
              <a
                key={platform}
                href={url}
                target={url.startsWith('http') ? '_blank' : undefined}
                rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-gold-500/20 flex items-center justify-center text-white/40 hover:text-gold-400 transition-all duration-300"
                aria-label={platform}
              >
                {platform === 'facebook' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                )}
                {platform === 'instagram' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
                )}
                {platform === 'twitter' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
