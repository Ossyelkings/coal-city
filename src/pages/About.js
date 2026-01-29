import React from 'react';

const values = [
  {
    title: 'Quality First',
    desc: 'Every product in our showroom passes rigorous quality checks. We partner only with manufacturers who share our obsession with excellence.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: 'Customer Commitment',
    desc: 'Your satisfaction drives everything we do. From consultation to installation support, we\'re with you every step of the way.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    title: 'Integrity',
    desc: 'Transparent pricing, honest advice, and genuine products. We build lasting relationships on a foundation of trust.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Innovation',
    desc: 'We stay ahead of industry trends, bringing the latest in bathroom technology and design to the Nigerian market.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const team = [
  { name: 'Chukwuemeka Obi', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
  { name: 'Adaeze Nwosu', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face' },
  { name: 'Ifeanyi Eze', role: 'Technical Director', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face' },
  { name: 'Ngozi Okeke', role: 'Customer Relations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face' },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative py-40 pb-28 bg-navy-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 30% 60%, #1e3a5f, transparent)',
          }}
        />
        <div className="absolute top-20 right-16 w-56 h-56 border border-gold-500/10 rounded-full" />
        <div className="absolute bottom-20 left-10 w-32 h-32 border border-gold-500/5 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-6 animate-fade-in-up">
            Our Story
          </span>
          <h1 className="animate-fade-in-up delay-100 font-display text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight max-w-3xl">
            Crafting Bathroom
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-500"> Excellence </span>
            Since 2009
          </h1>
          <p className="animate-fade-in-up delay-200 mt-6 text-lg text-white/50 leading-relaxed max-w-2xl">
            From a small plumbing supply store in Enugu to one of Nigeria's most trusted names in luxury bathroom fixtures — this is our journey.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="relative py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Showroom image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"
                  alt="Our showroom"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-navy-950 font-bold text-2xl">15+</div>
                  <div className="text-navy-950/60 text-[10px] uppercase tracking-wider font-semibold">Years</div>
                </div>
              </div>
            </div>

            {/* Story text */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                Who We Are
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mt-3 tracking-tight">
                More Than a Store — A Partner in Building Your Dream Space
              </h2>
              <div className="mt-6 space-y-4 text-navy-600/70 leading-relaxed">
                <p>
                  Coal City Jacuzzi and Plumbing Supplies was founded with a clear vision: to bring world-class bathroom fixtures and plumbing materials to Nigeria's growing market. Based in the heart of Enugu — the Coal City — we've grown from a modest storefront to a renowned destination for homeowners, contractors, and architects.
                </p>
                <p>
                  Our curated collection spans from luxurious jacuzzis and freestanding bathtubs to practical, high-performance plumbing components. Every product we stock is selected for its quality, durability, and aesthetic appeal.
                </p>
                <p>
                  We believe that everyone deserves a bathroom that inspires. That's why we offer competitive pricing without compromising on quality, backed by expert advice from our experienced team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative py-24 bg-navy-900 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        <div
          className="absolute inset-0 opacity-15"
          style={{ background: 'radial-gradient(ellipse 40% 60% at 90% 30%, #1e3a5f, transparent)' }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Our Mission</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight leading-snug">
            To make premium bathroom solutions accessible to every Nigerian home and business, with uncompromising quality and personalized service.
          </h2>
          <div className="mt-6 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">What Drives Us</span>
            <h2 className="font-display text-4xl font-bold text-navy-900 mt-3 tracking-tight">Our Core Values</h2>
            <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <div
                key={val.title}
                className="group p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg hover:shadow-navy-900/5 border border-cream-200/50 hover:border-gold-500/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400/10 to-gold-600/10 border border-gold-500/15 flex items-center justify-center text-gold-600 mb-5 group-hover:from-gold-400/20 group-hover:to-gold-600/20 transition-colors duration-300">
                  {val.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-navy-900 mb-2">{val.title}</h3>
                <p className="text-sm text-navy-600/60 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 bg-cream-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">The People</span>
            <h2 className="font-display text-4xl font-bold text-navy-900 mt-3 tracking-tight">Meet Our Team</h2>
            <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={member.name}
                className="group text-center"
              >
                <div className="aspect-square rounded-2xl relative overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy-900 mt-5">{member.name}</h3>
                <p className="text-sm text-gold-600 font-medium mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
