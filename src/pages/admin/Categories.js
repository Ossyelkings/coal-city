import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../../services/categoryService';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.list();
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryService.remove(deleteTarget._id);
      setDeleteTarget(null);
      fetchCategories();
    } catch {
      // keep modal open
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 tracking-tight">Categories</h1>
          <p className="text-sm text-navy-500/60 mt-1">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <Link
          to="/admin/categories/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-cream-100 rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-navy-500/50">No categories yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-100">
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Order</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Name</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 hidden md:table-cell">Slug</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 hidden lg:table-cell">Description</th>
                  <th className="text-right px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="w-7 h-7 rounded-lg bg-cream-100 flex items-center justify-center text-xs font-semibold text-navy-600">
                        {cat.order ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {cat.image && (
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                            <img src={cat.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="font-medium text-navy-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-navy-500/50 font-mono text-xs hidden md:table-cell">{cat.slug}</td>
                    <td className="px-6 py-3.5 text-navy-600/50 hidden lg:table-cell">
                      <span className="truncate block max-w-[250px]">{cat.description || '—'}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/categories/${cat._id}/edit`}
                          className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-gold-500/10 flex items-center justify-center text-navy-500 hover:text-gold-600 transition-colors"
                          title="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-red-50 flex items-center justify-center text-navy-500 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-navy-900">Delete Category</h3>
            <p className="mt-2 text-sm text-navy-600/60">
              Delete <span className="font-semibold text-navy-800">{deleteTarget.name}</span>? Products in this category will be affected.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-cream-200 text-sm font-medium text-navy-700 hover:bg-cream-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
