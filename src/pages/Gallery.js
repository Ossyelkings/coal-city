import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const fallbackProducts = [
  { id: 1, name: 'Serenity Pro Jacuzzi', category: 'Jacuzzis', description: '6-person luxury hot tub with LED lighting and 48 massage jets', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop' },
  { id: 2, name: 'AquaSpa Elite', category: 'Jacuzzis', description: 'Compact 4-person jacuzzi with built-in aromatherapy system', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop' },
  { id: 3, name: 'Grand Oasis Whirlpool', category: 'Jacuzzis', description: 'Premium 8-person spa with waterfall feature and Bluetooth audio', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop' },
  { id: 4, name: 'Milano Freestanding Tub', category: 'Bathtubs', description: 'Italian-inspired oval freestanding bathtub in glossy white', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop' },
  { id: 5, name: 'Cascade Soaking Tub', category: 'Bathtubs', description: 'Deep soaking tub with ergonomic backrest and overflow drain', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop' },
  { id: 6, name: 'Neo Corner Bath', category: 'Bathtubs', description: 'Space-saving corner bathtub with integrated armrests', image: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=600&h=400&fit=crop' },
  { id: 7, name: 'Artisan Vessel Sink', category: 'Sinks', description: 'Hand-crafted ceramic vessel basin with gold trim detail', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop&q=80' },
  { id: 8, name: 'Crystal Undermount Sink', category: 'Sinks', description: 'Sleek rectangular undermount sink in polished stainless', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop' },
  { id: 9, name: 'Nova Pedestal Basin', category: 'Sinks', description: 'Contemporary pedestal sink with clean lines and generous bowl', image: 'https://images.unsplash.com/photo-1595514535116-52652a006ea4?w=600&h=400&fit=crop' },
  { id: 10, name: 'Zenith Smart Toilet', category: 'Water Closets', description: 'Wall-hung smart toilet with bidet, heated seat and auto-flush', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop&q=80' },
  { id: 11, name: 'Classic Dual-Flush WC', category: 'Water Closets', description: 'Water-efficient dual-flush toilet with soft-close seat', image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&h=400&fit=crop' },
  { id: 12, name: 'Eclipse One-Piece', category: 'Water Closets', description: 'Seamless one-piece design with powerful siphon flush system', image: 'https://images.unsplash.com/photo-1585847497744-39a0b3ccfb14?w=600&h=400&fit=crop' },
  { id: 13, name: 'PVC Pressure Pipes', category: 'Pipes & Fittings', description: 'High-grade PVC pipes for hot and cold water systems, 20\u2013110mm', image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop' },
  { id: 14, name: 'Brass Compression Set', category: 'Pipes & Fittings', description: 'Professional brass compression fittings, elbows, and tees', image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600&h=400&fit=crop' },
  { id: 15, name: 'Copper Pipe Kit', category: 'Pipes & Fittings', description: 'Premium copper piping for durable plumbing installations', image: 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=600&h=400&fit=crop' },
  { id: 16, name: 'Gate Valve Series', category: 'Valves', description: 'Heavy-duty brass gate valves for main line control, \u00BD"\u20132"', image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600&h=400&fit=crop&q=80' },
  { id: 17, name: 'Ball Valve Pro', category: 'Valves', description: 'Chrome-plated brass ball valves with quarter-turn operation', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop' },
  { id: 18, name: 'Check Valve Kit', category: 'Valves', description: 'Spring-loaded check valves to prevent backflow in pipelines', image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop&q=80' },
];

export default function Gallery({ onQuoteClick }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [usingApi, setUsingApi] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.list({ limit: 100 }),
          categoryService.list(),
        ]);

        if (prodRes?.data?.products?.length) {
          setProducts(prodRes.data.products);
          setUsingApi(true);
        } else {
          setProducts(fallbackProducts);
        }

        if (catRes?.data?.length) {
          setCategories(['All', ...catRes.data.map((c) => c.name)]);
        } else {
          setCategories(['All', 'Jacuzzis', 'Bathtubs', 'Sinks', 'Water Closets', 'Pipes & Fittings', 'Valves']);
        }
      } catch {
        setProducts(fallbackProducts);
        setCategories(['All', 'Jacuzzis', 'Bathtubs', 'Sinks', 'Water Closets', 'Pipes & Fittings', 'Valves']);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (product) => {
    if (usingApi && product.category) {
      return typeof product.category === 'object' ? product.category.name : product.category;
    }
    return product.category;
  };

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => getCategoryName(p) === activeCategory);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative py-40 pb-20 bg-navy-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 60% 50%, #1e3a5f, transparent)' }}
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

      {/* GALLERY */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((cat) => (
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-56 bg-cream-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-cream-200 rounded w-3/4" />
                    <div className="h-4 bg-cream-100 rounded w-full" />
                    <div className="h-10 bg-cream-200 rounded-xl w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((product, i) => (
                <div
                  key={product._id || product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-navy-900/10 border border-cream-200/50 hover:border-gold-500/20 transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-lg bg-navy-950/60 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
                        {getCategoryName(product)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-navy-900 group-hover:text-navy-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-navy-600/55 leading-relaxed">
                      {product.description || product.desc}
                    </p>
                    <button
                      onClick={() => onQuoteClick(getCategoryName(product))}
                      className="mt-5 w-full py-3 rounded-xl border-2 border-gold-500/20 text-gold-600 text-sm font-semibold hover:bg-gold-500 hover:text-navy-950 hover:border-gold-500 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20"
                    >
                      Ask for Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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
