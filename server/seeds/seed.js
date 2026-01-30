require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const TeamMember = require('../models/TeamMember');
const CompanyInfo = require('../models/CompanyInfo');

const categoriesData = [
  {
    name: 'Jacuzzis',
    description: 'Luxury hot tubs for ultimate relaxation',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop',
    icon: '\u25C6',
    order: 0,
  },
  {
    name: 'Bathtubs',
    description: 'Freestanding & built-in designs',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
    icon: '\u25C7',
    order: 1,
  },
  {
    name: 'Sinks',
    description: 'Elegant vanity & kitchen sinks',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&h=400&fit=crop',
    icon: '\u25CB',
    order: 2,
  },
  {
    name: 'Water Closets',
    description: 'Modern toilets & bidets',
    image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600&h=400&fit=crop',
    icon: '\u25A1',
    order: 3,
  },
  {
    name: 'Pipes & Fittings',
    description: 'Professional-grade plumbing',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop',
    icon: '\u2550',
    order: 4,
  },
  {
    name: 'Valves',
    description: 'Precision flow control systems',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&h=400&fit=crop',
    icon: '\u2295',
    order: 5,
  },
];

// Products grouped by category name (will be resolved to ObjectId during seeding)
const productsData = [
  // Jacuzzis
  { name: 'Serenity Pro Jacuzzi', category: 'Jacuzzis', description: '6-person luxury hot tub with LED lighting and 48 massage jets', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop', featured: true },
  { name: 'AquaSpa Elite', category: 'Jacuzzis', description: 'Compact 4-person jacuzzi with built-in aromatherapy system', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop' },
  { name: 'Grand Oasis Whirlpool', category: 'Jacuzzis', description: 'Premium 8-person spa with waterfall feature and Bluetooth audio', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop', featured: true },

  // Bathtubs
  { name: 'Milano Freestanding Tub', category: 'Bathtubs', description: 'Italian-inspired oval freestanding bathtub in glossy white', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop', featured: true },
  { name: 'Cascade Soaking Tub', category: 'Bathtubs', description: 'Deep soaking tub with ergonomic backrest and overflow drain', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop' },
  { name: 'Neo Corner Bath', category: 'Bathtubs', description: 'Space-saving corner bathtub with integrated armrests', image: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=600&h=400&fit=crop' },

  // Sinks
  { name: 'Artisan Vessel Sink', category: 'Sinks', description: 'Hand-crafted ceramic vessel basin with gold trim detail', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop&q=80' },
  { name: 'Crystal Undermount Sink', category: 'Sinks', description: 'Sleek rectangular undermount sink in polished stainless', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop' },
  { name: 'Nova Pedestal Basin', category: 'Sinks', description: 'Contemporary pedestal sink with clean lines and generous bowl', image: 'https://images.unsplash.com/photo-1595514535116-52652a006ea4?w=600&h=400&fit=crop' },

  // Water Closets
  { name: 'Zenith Smart Toilet', category: 'Water Closets', description: 'Wall-hung smart toilet with bidet, heated seat and auto-flush', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop&q=80', featured: true },
  { name: 'Classic Dual-Flush WC', category: 'Water Closets', description: 'Water-efficient dual-flush toilet with soft-close seat', image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&h=400&fit=crop' },
  { name: 'Eclipse One-Piece', category: 'Water Closets', description: 'Seamless one-piece design with powerful siphon flush system', image: 'https://images.unsplash.com/photo-1585847497744-39a0b3ccfb14?w=600&h=400&fit=crop' },

  // Pipes & Fittings
  { name: 'PVC Pressure Pipes', category: 'Pipes & Fittings', description: 'High-grade PVC pipes for hot and cold water systems, 20\u2013110mm', image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop' },
  { name: 'Brass Compression Set', category: 'Pipes & Fittings', description: 'Professional brass compression fittings, elbows, and tees', image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600&h=400&fit=crop' },
  { name: 'Copper Pipe Kit', category: 'Pipes & Fittings', description: 'Premium copper piping for durable plumbing installations', image: 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=600&h=400&fit=crop' },

  // Valves
  { name: 'Gate Valve Series', category: 'Valves', description: 'Heavy-duty brass gate valves for main line control, \u00BD"\u20132"', image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600&h=400&fit=crop&q=80' },
  { name: 'Ball Valve Pro', category: 'Valves', description: 'Chrome-plated brass ball valves with quarter-turn operation', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop' },
  { name: 'Check Valve Kit', category: 'Valves', description: 'Spring-loaded check valves to prevent backflow in pipelines', image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop&q=80' },
];

const teamData = [
  { name: 'Chukwuemeka Obi', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', order: 0 },
  { name: 'Adaeze Nwosu', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face', order: 1 },
  { name: 'Ifeanyi Eze', role: 'Technical Director', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', order: 2 },
  { name: 'Ngozi Okeke', role: 'Customer Relations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', order: 3 },
];

const companyData = {
  name: 'Coal City Jacuzzi & Plumbing Supplies',
  tagline: 'Premium Bathroom Solutions',
  description:
    'Coal City Jacuzzi and Plumbing Supplies was founded with a clear vision: to bring world-class bathroom fixtures and plumbing materials to Nigeria\u2019s growing market. Based in the heart of Enugu \u2014 the Coal City \u2014 we\u2019ve grown from a modest storefront to a renowned destination for homeowners, contractors, and architects.',
  mission:
    'To make premium bathroom solutions accessible to every Nigerian home and business, with uncompromising quality and personalized service.',
  address: '123 Ogui Road, Enugu, Nigeria',
  phone: '+234 800 COAL CITY',
  email: 'info@coalcityplumbing.com',
  whatsapp: '+234 801 234 5678',
  foundedYear: 2009,
  socialLinks: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
  },
  businessHours: [
    { day: 'Monday \u2013 Friday', time: '8:00 AM \u2013 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM \u2013 4:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
  stats: {
    products: '500+',
    clients: '2,000+',
    years: '15+',
  },
};

async function seed() {
  try {
    await connectDB();
    console.log('Clearing existing data...');

    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      TeamMember.deleteMany({}),
      CompanyInfo.deleteMany({}),
    ]);

    // 1. Create admin user
    console.log('Creating admin user...');
    await User.create({
      name: 'Admin',
      email: 'admin@coalcityplumbing.com',
      password: 'admin1234',
      role: 'admin',
    });
    console.log('  Admin created (email: admin@coalcityplumbing.com, password: admin1234)');

    // 2. Create categories
    console.log('Creating categories...');
    const categories = await Category.insertMany(categoriesData);
    console.log(`  ${categories.length} categories created`);

    // Build a lookup map: category name -> ObjectId
    const categoryMap = {};
    for (const cat of categories) {
      categoryMap[cat.name] = cat._id;
    }

    // 3. Create products (resolve category names to ObjectIds)
    console.log('Creating products...');
    const productsWithRefs = productsData.map((p) => ({
      ...p,
      category: categoryMap[p.category],
    }));
    const products = await Product.insertMany(productsWithRefs);
    console.log(`  ${products.length} products created`);

    // 4. Create team members
    console.log('Creating team members...');
    const team = await TeamMember.insertMany(teamData);
    console.log(`  ${team.length} team members created`);

    // 5. Create company info
    console.log('Creating company info...');
    await CompanyInfo.create(companyData);
    console.log('  Company info created');

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
