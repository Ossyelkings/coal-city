import React, { useState } from 'react';

const products = [
  // Jacuzzis
  { id: 1, name: 'Serenity Pro Jacuzzi', category: 'Jacuzzis', desc: '6-person luxury hot tub with LED lighting and 48 massage jets', gradient: 'from-navy-700 via-blue-600 to-teal-500', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop' },
  { id: 2, name: 'AquaSpa Elite', category: 'Jacuzzis', desc: 'Compact 4-person jacuzzi with built-in aromatherapy system', gradient: 'from-teal-600 via-cyan-500 to-blue-500', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop' },
  { id: 3, name: 'Grand Oasis Whirlpool', category: 'Jacuzzis', desc: 'Premium 8-person spa with waterfall feature and Bluetooth audio', gradient: 'from-blue-700 via-indigo-600 to-navy-700', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop' },

  // Bathtubs
  { id: 4, name: 'Milano Freestanding Tub', category: 'Bathtubs', desc: 'Italian-inspired oval freestanding bathtub in glossy white', gradient: 'from-gray-100 via-blue-100 to-gray-200', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop' },
  { id: 5, name: 'Cascade Soaking Tub', category: 'Bathtubs', desc: 'Deep soaking tub with ergonomic backrest and overflow drain', gradient: 'from-teal-400 via-cyan-300 to-blue-400', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop' },
  { id: 6, name: 'Neo Corner Bath', category: 'Bathtubs', desc: 'Space-saving corner bathtub with integrated armrests', gradient: 'from-slate-300 via-gray-200 to-slate-400', image: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=600&h=400&fit=crop' },

  // Sinks
  { id: 7, name: 'Artisan Vessel Sink', category: 'Sinks', desc: 'Hand-crafted ceramic vessel basin with gold trim detail', gradient: 'from-gold-500 via-amber-400 to-gold-600', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop&q=80' },
  { id: 8, name: 'Crystal Undermount Sink', category: 'Sinks', desc: 'Sleek rectangular undermount sink in polished stainless', gradient: 'from-gray-400 via-slate-300 to-gray-500', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop' },
  { id: 9, name: 'Nova Pedestal Basin', category: 'Sinks', desc: 'Contemporary pedestal sink with clean lines and generous bowl', gradient: 'from-blue-200 via-cyan-100 to-teal-200', image: 'https://images.unsplash.com/photo-1595514535116-52652a006ea4?w=600&h=400&fit=crop' },

  // Water Closets
  { id: 10, name: 'Zenith Smart Toilet', category: 'Water Closets', desc: 'Wall-hung smart toilet with bidet, heated seat and auto-flush', gradient: 'from-navy-800 via-navy-600 to-blue-500', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop&q=80' },
  { id: 11, name: 'Classic Dual-Flush WC', category: 'Water Closets', desc: 'Water-efficient dual-flush toilet with soft-close seat', gradient: 'from-gray-300 via-blue-200 to-gray-400', image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&h=400&fit=crop' },
  { id: 12, name: 'Eclipse One-Piece', category: 'Water Closets', desc: 'Seamless one-piece design with powerful siphon flush system', gradient: 'from-slate-500 via-gray-400 to-slate-600', image: 'https://images.unsplash.com/photo-1585847497744-39a0b3ccfb14?w=600&h=400&fit=crop' },

  // Pipes & Fittings
  { id: 13, name: 'PVC Pressure Pipes', category: 'Pipes & Fittings', desc: 'High-grade PVC pipes for hot and cold water systems, 20–110mm', gradient: 'from-gray-500 via-slate-400 to-gray-600', image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop' },
  { id: 14, name: 'Brass Compression Set', category: 'Pipes & Fittings', desc: 'Professional brass compression fittings, elbows, and tees', gradient: 'from-gold-600 via-yellow-500 to-amber-600', image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600&h=400&fit=crop' },
  { id: 15, name: 'Copper Pipe Kit', category: 'Pipes & Fittings', desc: 'Premium copper piping for durable plumbing installations', gradient: 'from-orange-600 via-amber-500 to-orange-700', image: 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=600&h=400&fit=crop' },

  // Valves
  { id: 16, name: 'Gate Valve Series', category: 'Valves', desc: 'Heavy-duty brass gate valves for main line control, ½"–2"', gradient: 'from-gold-700 via-amber-600 to-gold-500', image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600&h=400&fit=crop&q=80' },
  { id: 17, name: 'Ball Valve Pro', category: 'Valves', desc: 'Chrome-plated brass ball valves with quarter-turn operation', gradient: 'from-gray-600 via-slate-500 to-gray-700', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop' },
  { id: 18, name: 'Check Valve Kit', category: 'Valves', desc: 'Spring-loaded check valves to prevent backflow in pipelines', gradient: 'from-navy-600 via-blue-500 to-navy-700', image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop&q=80' },
];

const categories = ['All', 'Jacuzzis', 'Bathtubs', 'Sinks', 'Water Closets', 'Pipes & Fittings', 'Valves'];

export default function Gallery({ onQuoteClick }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-40 pb-20 bg-navy-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 60% 50%, #1e3a5f, transparent)',
          }}
        />
        <div className="absolute top-24 left-16 w-40 h-40 border border-gold-500/10 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-6 animate-fade-in-up">
            Our Collection
          </span>
          <h1 className="animate-fade-in-up delay-100 font-display text-5xl sm:text-6xl font-bold text-white tracking-tight">
            Product Gallery
          </h1>
          <p className="animate-fade-in-up delay-200 mt-4 text-lg text-white/50 max-w-xl">
            Browse our curated selection of premium bathroom fixtures and professional plumbing supplies.
          </p>
        </div>
      </section>

      {/* ═══════════════ GALLERY ═══════════════ */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-navy-900 text-gold-400 shadow-lg shadow-navy-900/20'
                    : 'bg-white text-navy-600/60 hover:bg-navy-900/5 hover:text-navy-900 border border-cream-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-navy-900/10 border border-cream-200/50 hover:border-gold-500/20 transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Product image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg bg-navy-950/60 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product info */}
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-navy-900 group-hover:text-navy-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-navy-600/55 leading-relaxed">
                    {product.desc}
                  </p>
                  <button
                    onClick={() => onQuoteClick(product.category)}
                    className="mt-5 w-full py-3 rounded-xl border-2 border-gold-500/20 text-gold-600 text-sm font-semibold hover:bg-gold-500 hover:text-navy-950 hover:border-gold-500 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20"
                  >
                    Ask for Quote
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <p className="text-navy-600/50 text-sm mb-4">
              Don't see what you're looking for? We can source it for you.
            </p>
            <button
              onClick={() => onQuoteClick()}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm tracking-wide hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-1"
            >
              Request Custom Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
