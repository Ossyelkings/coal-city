import React, { useState, useEffect } from 'react';
import teamService from '../../services/teamService';
import api from '../../services/api';

const emptyMember = { name: '', role: '', image: '', order: 0 };

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null); // null | 'new' | member object
  const [formData, setFormData] = useState(emptyMember);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await teamService.list();
      setMembers(res.data || []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openNew = () => {
    setFormData({ ...emptyMember, order: members.length });
    setError('');
    setEditModal('new');
  };

  const openEdit = (member) => {
    setFormData({
      name: member.name || '',
      role: member.role || '',
      image: member.image || '',
      order: member.order ?? 0,
    });
    setError('');
    setEditModal(member);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editModal === 'new') {
        await teamService.create(formData);
      } else {
        await teamService.update(editModal._id, formData);
      }
      setEditModal(null);
      fetchTeam();
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await teamService.remove(deleteTarget._id);
      setDeleteTarget(null);
      fetchTeam();
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
          <h1 className="font-display text-2xl font-bold text-navy-900 tracking-tight">Team Members</h1>
          <p className="text-sm text-navy-500/60 mt-1">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Card grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-cream-200 rounded-2xl h-64" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm p-12 text-center">
          <p className="text-sm text-navy-500/50">No team members yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl border border-cream-200/80 shadow-sm overflow-hidden group hover:shadow-lg hover:shadow-navy-900/5 transition-all duration-300"
            >
              <div className="aspect-square bg-cream-100 relative overflow-hidden">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy-200 to-navy-300 flex items-center justify-center">
                    <span className="font-display text-4xl font-bold text-white/60">
                      {member.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                {/* Action overlay */}
                <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/40 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(member)}
                    className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-navy-700 hover:bg-gold-400 hover:text-navy-950 transition-colors shadow-lg"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(member)}
                    className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-display text-base font-bold text-navy-900">{member.name}</h3>
                <p className="text-xs text-gold-600 font-medium mt-0.5">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create modal */}
      {editModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={() => !saving && setEditModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-display text-lg font-bold text-navy-900 mb-5">
              {editModal === 'new' ? 'Add Team Member' : 'Edit Team Member'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Role *</label>
                <input
                  type="text"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                  placeholder="e.g. Head of Sales"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Order</label>
                <input
                  type="number"
                  name="order"
                  min="0"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-24 px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Photo</label>
                {formData.image && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-100 mb-2">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-cream-300 text-xs text-navy-500/60 cursor-pointer hover:border-gold-500/30 hover:text-gold-600 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="or paste URL"
                    className="flex-1 px-3 py-2 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl border border-cream-200 text-sm font-medium text-navy-700 hover:bg-cream-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : editModal === 'new' ? 'Add Member' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <h3 className="font-display text-lg font-bold text-navy-900">Remove Team Member</h3>
            <p className="mt-2 text-sm text-navy-600/60">
              Remove <span className="font-semibold text-navy-800">{deleteTarget.name}</span> from the team?
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
                {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
