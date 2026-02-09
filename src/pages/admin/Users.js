import React, { useState, useEffect, useCallback } from 'react';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const roles = ['customer', 'admin'];

const roleColors = {
  customer: 'bg-blue-100 text-blue-700 border-blue-200',
  admin: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const limit = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const res = await userService.list(params);
      setUsers(res.data?.users || []);
      setTotal(res.data?.total || 0);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleRoleChange = async (id, newRole) => {
    if (id === currentUser?._id) {
      alert('Cannot change your own role');
      return;
    }
    setUpdatingId(id);
    try {
      await userService.update(id, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      alert('Cannot delete your own account');
      return;
    }
    setDeletingId(id);
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setTotal((t) => t - 1);
      setConfirmDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 tracking-tight">Users</h1>
        <p className="text-sm text-navy-500/60 mt-1">{total} user{total !== 1 ? 's' : ''} total</p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-white text-sm text-navy-800 placeholder:text-navy-400/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500/30 transition-all"
          />
        </div>

        {/* Role filter tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setRoleFilter(''); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              !roleFilter
                ? 'bg-navy-900 text-gold-400 shadow-lg shadow-navy-900/20'
                : 'bg-white text-navy-500/60 border border-cream-200 hover:bg-cream-50'
            }`}
          >
            All
          </button>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                roleFilter === r
                  ? 'bg-navy-900 text-gold-400 shadow-lg shadow-navy-900/20'
                  : 'bg-white text-navy-500/60 border border-cream-200 hover:bg-cream-50'
              }`}
            >
              {r}s
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-cream-100 rounded-xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-navy-500/50">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-100">
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Name</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Email</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 hidden md:table-cell">Phone</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Role</th>
                  <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50 hidden sm:table-cell">Joined</th>
                  <th className="text-right px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center text-gold-400 font-display font-bold text-xs border border-navy-600/30">
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-navy-900">
                          {u.name}
                          {u._id === currentUser?._id && (
                            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-gold-600">(You)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-navy-600/60">{u.email}</td>
                    <td className="px-6 py-3.5 text-navy-600/50 hidden md:table-cell">{u.phone || '—'}</td>
                    <td className="px-6 py-3.5">
                      <select
                        value={u.role || 'customer'}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={updatingId === u._id || u._id === currentUser?._id}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border cursor-pointer focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${roleColors[u.role] || roleColors.customer}`}
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-navy-500/50 text-xs hidden sm:table-cell whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {u._id !== currentUser?._id && (
                        confirmDelete === u._id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDelete(u._id)}
                              disabled={deletingId === u._id}
                              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
                            >
                              {deletingId === u._id ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1.5 rounded-lg border border-cream-200 text-xs font-medium text-navy-600 hover:bg-cream-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(u._id)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors ml-auto"
                            title="Delete user"
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
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        )
                      )}
                    </td>
                  </tr>
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
