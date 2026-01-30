import React, { useState, useEffect, useCallback } from 'react';
import contactService from '../../services/contactService';

const statuses = ['new', 'read', 'replied', 'archived'];

const statusColors = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  read: 'bg-amber-100 text-amber-700 border-amber-200',
  replied: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  archived: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function Contacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const limit = 15;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sort: '-createdAt' };
      if (statusFilter) params.status = statusFilter;
      const res = await contactService.list(params);
      setMessages(res.data?.messages || res.data || []);
      setTotal(res.data?.total || 0);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await contactService.updateStatus(id, { status: newStatus });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
    } catch {
      // silent fail
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 tracking-tight">Contact Messages</h1>
        <p className="text-sm text-navy-500/60 mt-1">{total} message{total !== 1 ? 's' : ''} total</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setStatusFilter(''); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            !statusFilter
              ? 'bg-navy-900 text-gold-400 shadow-lg shadow-navy-900/20'
              : 'bg-white text-navy-500/60 border border-cream-200 hover:bg-cream-50'
          }`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              statusFilter === s
                ? 'bg-navy-900 text-gold-400 shadow-lg shadow-navy-900/20'
                : 'bg-white text-navy-500/60 border border-cream-200 hover:bg-cream-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-cream-100 rounded-xl" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-navy-500/50">No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-100">
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Name</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 hidden md:table-cell">Subject</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 hidden lg:table-cell">Email</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Status</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 hidden sm:table-cell">Date</th>
                  <th className="text-right px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {messages.map((m) => (
                  <React.Fragment key={m._id}>
                    <tr className="hover:bg-cream-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <span className={`font-medium ${m.status === 'new' ? 'text-navy-900' : 'text-navy-700'}`}>{m.name}</span>
                      </td>
                      <td className="px-6 py-3.5 text-navy-600/60 hidden md:table-cell">
                        <span className="truncate block max-w-[200px]">{m.subject || '—'}</span>
                      </td>
                      <td className="px-6 py-3.5 text-navy-600/50 hidden lg:table-cell">{m.email}</td>
                      <td className="px-6 py-3.5">
                        <select
                          value={m.status || 'new'}
                          onChange={(e) => handleStatusChange(m._id, e.target.value)}
                          disabled={updatingId === m._id}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border cursor-pointer focus:outline-none transition-colors disabled:opacity-50 ${statusColors[m.status] || statusColors.new}`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3.5 text-navy-500/50 text-xs hidden sm:table-cell whitespace-nowrap">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => setExpandedId(expandedId === m._id ? null : m._id)}
                          className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-gold-500/10 flex items-center justify-center text-navy-500 hover:text-gold-600 transition-colors ml-auto"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-200 ${expandedId === m._id ? 'rotate-180' : ''}`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {expandedId === m._id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-5 bg-cream-50/80">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 block mb-1">Phone</span>
                              <span className="text-navy-800">{m.phone || '—'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 block mb-1">Email</span>
                              <span className="text-navy-800">{m.email}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 block mb-1">Subject</span>
                              <span className="text-navy-800">{m.subject || '—'}</span>
                            </div>
                            <div className="sm:col-span-3">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 block mb-1">Message</span>
                              <p className="text-navy-700 whitespace-pre-wrap leading-relaxed">{m.message || 'No message.'}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-cream-100 flex items-center justify-between">
            <p className="text-xs text-navy-500/50">Page {page} of {totalPages}</p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-cream-200 text-xs font-medium text-navy-600 hover:bg-cream-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-cream-200 text-xs font-medium text-navy-600 hover:bg-cream-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
