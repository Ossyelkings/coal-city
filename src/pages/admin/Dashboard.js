import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import quoteService from '../../services/quoteService';
import contactService from '../../services/contactService';
import categoryService from '../../services/categoryService';

const statIcons = {
  products: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  quotes: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  contacts: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  categories: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
};

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-amber-100 text-amber-700',
  contacted: 'bg-purple-100 text-purple-700',
  quoted: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-600',
  read: 'bg-amber-100 text-amber-700',
  replied: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-gray-100 text-gray-600',
};

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, quotes: 0, contacts: 0, categories: 0 });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, quoteRes, contactRes, catRes] = await Promise.all([
          productService.list({ limit: 1 }).catch(() => null),
          quoteService.list({ limit: 5, sort: '-createdAt' }).catch(() => null),
          contactService.list({ limit: 5, sort: '-createdAt' }).catch(() => null),
          categoryService.list().catch(() => null),
        ]);

        setStats({
          products: prodRes?.data?.total || prodRes?.data?.products?.length || 0,
          quotes: quoteRes?.data?.total || quoteRes?.data?.quotes?.length || 0,
          contacts: contactRes?.data?.total || contactRes?.data?.messages?.length || 0,
          categories: catRes?.data?.length || 0,
        });

        setRecentQuotes(
          (quoteRes?.data?.quotes || quoteRes?.data || []).slice(0, 5)
        );
        setRecentContacts(
          (contactRes?.data?.messages || contactRes?.data || []).slice(0, 5)
        );
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { key: 'products', label: 'Products', value: stats.products, color: 'from-blue-500 to-blue-600', link: '/admin/products' },
    { key: 'categories', label: 'Categories', value: stats.categories, color: 'from-emerald-500 to-emerald-600', link: '/admin/categories' },
    { key: 'quotes', label: 'Quote Requests', value: stats.quotes, color: 'from-gold-500 to-gold-600', link: '/admin/quotes' },
    { key: 'contacts', label: 'Contact Messages', value: stats.contacts, color: 'from-purple-500 to-purple-600', link: '/admin/contacts' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-cream-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-cream-200" />
          <div className="h-64 rounded-2xl bg-cream-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-navy-500/60 mt-1">Overview of your store activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.key}
            to={card.link}
            className="group relative p-5 rounded-2xl bg-white border border-cream-200/80 hover:border-gold-500/20 shadow-sm hover:shadow-lg hover:shadow-navy-900/5 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-500/50">{card.label}</p>
                <p className="font-display text-3xl font-bold text-navy-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg shadow-${card.key === 'quotes' ? 'gold' : 'navy'}-500/20`}>
                {statIcons[card.key]}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-cream-100 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-navy-900">Recent Quotes</h2>
            <Link to="/admin/quotes" className="text-xs font-semibold text-gold-600 hover:text-gold-500 transition-colors">
              View all
            </Link>
          </div>
          {recentQuotes.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-navy-500/40">No quote requests yet</div>
          ) : (
            <div className="divide-y divide-cream-100">
              {recentQuotes.map((q) => (
                <div key={q._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-cream-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">{q.name}</p>
                    <p className="text-xs text-navy-500/50 truncate">{q.product || 'No product specified'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${statusColors[q.status] || 'bg-blue-100 text-blue-700'}`}>
                    {q.status || 'new'}
                  </span>
                  <span className="text-[11px] text-navy-500/40 whitespace-nowrap">
                    {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-cream-100 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-navy-900">Recent Messages</h2>
            <Link to="/admin/contacts" className="text-xs font-semibold text-gold-600 hover:text-gold-500 transition-colors">
              View all
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-navy-500/40">No messages yet</div>
          ) : (
            <div className="divide-y divide-cream-100">
              {recentContacts.map((c) => (
                <div key={c._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-cream-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">{c.name}</p>
                    <p className="text-xs text-navy-500/50 truncate">{c.subject || c.message?.slice(0, 50) || ''}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${statusColors[c.status] || 'bg-blue-100 text-blue-700'}`}>
                    {c.status || 'new'}
                  </span>
                  <span className="text-[11px] text-navy-500/40 whitespace-nowrap">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
