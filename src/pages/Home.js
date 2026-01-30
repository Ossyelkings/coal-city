import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../services/categoryService';
import companyService from '../services/companyService';

const reasons = [
  {
    title: 'Premium Quality',
    desc: "We source only from the world's leading manufacturers, ensuring every product meets the highest standards.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: 'Expert Guidance',
    desc: 'Our trained team helps you choose the perfect fixtures for your space, budget, and aesthetic preferences.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Nationwide Delivery',
    desc: 'We deliver across Nigeria with careful handling and protective packaging for every item, big or small.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Competitive Pricing',
    desc: "Luxury doesn't have to break the bank. We offer the best prices on premium bathroom fixtures in the region.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
];

const fallbackCategories = [
  { name: 'Jacuzzis', description: 'Luxury hot tubs for ultimate relaxation', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop', icon: '\u25C6' },
  { name: 'Bathtubs', description: 'Freestanding & built-in designs', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop', icon: '\u25C7' },
  { name: 'Sinks & Basins', description: 'Elegant vanity & kitchen sinks', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&h=400&fit=crop', icon: '\u25CB' },
  { name: 'Water Closets', description: 'Modern toilets & bidets', image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600&h=400&fit=crop', icon: '\u25A1' },
  { name: 'Pipes & Fittings', description: 'Professional-grade plumbing', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop', icon: '\u2550' },
  { name: 'Valves', description: 'Precision flow control systems', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&h=400&fit=crop', icon: '\u2295' },
];

const fallbackStats = { products: '500+', clients: '2,000+', years: '15+' };

export default function Home({ onQuoteClick }) {
  const [categories, setCategories] = useState(fallbackCategories);
  const [stats, setStats] = useState(fallbackStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, compRes] = await Promise.all([
          categoryService.list().catch(() => null),
          companyService.get().catch(() => null),
        ]);
        if (catRes?.data?.length) setCategories(catRes.data);
        if (compRes?.data?.stats) setStats(compRes.data.stats);
      } catch {
        // fallbacks already set
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&h=1080&fit=crop"
            alt="Luxury bathroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy-950/80" />
        </div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 70% 40%, #1e3a5f, transparent), radial-gradient(ellipse 60% 50% at 20% 80%, #0f2035, transparent)',
          }}
        />
        <div className="absolute top-20 right-[10%] w-72 h-72 border border-gold-500/10 rounded-full animate-float" />
        <div className="absolute bottom-32 right-[20%] w-48 h-48 border border-gold-500/5 rounded-full" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-[5%] w-px h-40 bg-gradient-to-b from-transparent via-gold-500/20 to-transparent" />
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-10"
          style={{ background: 'radial-gradient(circle at top right, #d4a853, transparent 60%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-gold-pulse" />
                Premium Bathroom Solutions
              </span>
            </div>

            <h1 className="animate-fade-in-up delay-100 font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Elevate Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400">
                Bathroom
              </span>
              Experience
            </h1>

            <p className="animate-fade-in-up delay-300 mt-7 text-lg text-white/50 leading-relaxed max-w-lg">
              Discover an exquisite collection of jacuzzis, bathtubs, sinks, and professional-grade plumbing supplies. Where luxury meets functionality.
            </p>

            <div className="animate-fade-in-up delay-400 mt-10 flex flex-wrap gap-4">
              <button
                onClick={onQuoteClick}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm tracking-wide hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-1 active:translate-y-0"
              >
                Request a Quote
              </button>
              <Link
                to="/gallery"
                className="px-8 py-4 rounded-xl border border-white/10 text-white/80 font-medium text-sm tracking-wide hover:bg-white/5 hover:border-white/20 hover:text-white transition-all duration-300"
              >
                Browse Collection
              </Link>
            </div>

            <div className="animate-fade-in-up delay-600 mt-14 flex gap-10">
              {[
                { num: stats.products, label: 'Products' },
                { num: stats.clients, label: 'Happy Clients' },
                { num: stats.years, label: 'Years' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold text-gold-400">{stat.num}</div>
                  <div className="text-xs text-white/40 mt-0.5 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative animate-fade-in delay-300">
            <div className="relative w-full aspect-[4/5] max-w-md ml-auto">
              <div className="absolute inset-4 rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=750&fit=crop"
                  alt="Luxury jacuzzi bathroom"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(212, 168, 83, 0.15) 100%)' }}
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-40 h-24 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl shadow-gold-500/20 flex items-center justify-center p-4 animate-fade-in-up delay-500">
                <div className="text-center">
                  <div className="font-display text-navy-950 font-bold text-xl">A+</div>
                  <div className="text-navy-950/60 text-[10px] uppercase tracking-wider font-semibold">Quality Rated</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-500/30 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-500/30 rounded-bl-3xl" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-800">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold-500/50 to-transparent" />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="relative py-28 bg-cream-50">
        <div
          className="absolute top-0 left-0 right-0 h-32 -mt-1"
          style={{ background: 'linear-gradient(180deg, #0a1628 0%, transparent 100%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">What We Offer</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-navy-900 mt-3 tracking-tight">Our Product Range</h2>
            <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-52 bg-cream-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-cream-200 rounded w-2/3" />
                    <div className="h-4 bg-cream-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <Link
                  to="/gallery"
                  key={cat.name}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-navy-900/10 transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="h-52 relative overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="absolute bottom-4 right-4 text-white/20 text-4xl font-display">{cat.icon}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-navy-900 group-hover:text-navy-700 transition-colors">{cat.name}</h3>
                    <p className="mt-1 text-sm text-navy-600/60">{cat.description || cat.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-gold-600 text-xs font-semibold uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                      View Collection
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative py-28 bg-navy-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 80% 50%, #1e3a5f, transparent)' }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Why Coal City</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 tracking-tight">Built on Trust</h2>
            <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, i) => (
              <div
                key={reason.title}
                className="group relative p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-gold-500/20 hover:bg-white/[0.06] transition-all duration-500"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-5 group-hover:bg-gold-500/20 transition-colors duration-300">
                  {reason.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 bg-cream-50 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(212, 168, 83, 0.08), transparent 60%)' }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-navy-900 tracking-tight leading-tight">
            Ready to Transform
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-500">Your Space?</span>
          </h2>
          <p className="mt-5 text-navy-600/60 text-lg max-w-xl mx-auto">
            Whether you're building from scratch or renovating, our team is ready to help you find the perfect fixtures and supplies.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={onQuoteClick}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm tracking-wide hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-1 active:translate-y-0"
            >
              Get Your Free Quote
            </button>
            <Link
              to="/contact"
              className="px-10 py-4 rounded-xl border-2 border-navy-900/10 text-navy-900 font-semibold text-sm tracking-wide hover:border-navy-900/20 hover:bg-navy-900/5 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
