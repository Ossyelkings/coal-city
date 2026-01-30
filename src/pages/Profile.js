import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import quoteService from '../services/quoteService';

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-amber-100 text-amber-700',
  contacted: 'bg-purple-100 text-purple-700',
  quoted: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-600',
};

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password form
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState('');

  // Quote history
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    quoteService.myQuotes()
      .then((res) => setQuotes(res.data?.quotes || res.data || []))
      .catch(() => setQuotes([]))
      .finally(() => setQuotesLoading(false));
  }, []);

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      await authService.updateProfile(profile);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (passwords.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }

    setPwSaving(true);
    try {
      await authService.updateProfile({
        currentPassword: passwords.currentPassword,
        password: passwords.newPassword,
      });
      setPwSuccess(true);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to change password'
      );
    } finally {
      setPwSaving(false);
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'quotes', label: 'My Quotes' },
    { key: 'password', label: 'Password' },
  ];

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all';

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-40 pb-20 bg-navy-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #1e3a5f, transparent)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-display font-bold text-2xl shadow-lg shadow-gold-500/20">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {user?.name || 'My Account'}
              </h1>
              <p className="mt-1 text-sm text-white/40">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-cream-50">
        <div className="max-w-3xl mx-auto px-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 border border-cream-200/80 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-navy-900 text-gold-400 shadow-md'
                    : 'text-navy-500/60 hover:text-navy-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm p-8">
              <h2 className="font-display text-lg font-bold text-navy-900 mb-6">Personal Information</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Phone</label>
                  <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className={inputClass} />
                </div>

                {profileError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{profileError}</div>
                )}
                {profileSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">Profile updated successfully.</div>
                )}

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Quotes Tab */}
          {activeTab === 'quotes' && (
            <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-cream-100">
                <h2 className="font-display text-lg font-bold text-navy-900">Quote History</h2>
                <p className="text-xs text-navy-500/50 mt-1">Your submitted quote requests and their statuses</p>
              </div>

              {quotesLoading ? (
                <div className="p-8 space-y-4 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-cream-100 rounded-xl" />
                  ))}
                </div>
              ) : quotes.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cream-100 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <p className="text-sm text-navy-500/50">No quotes submitted yet</p>
                  <p className="text-xs text-navy-500/30 mt-1">Your quote requests will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-cream-100">
                  {quotes.map((q) => (
                    <div key={q._id} className="px-8 py-5 hover:bg-cream-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-sm font-semibold text-navy-900">{q.product || 'General Inquiry'}</h3>
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${statusColors[q.status] || 'bg-blue-100 text-blue-700'}`}>
                              {q.status || 'new'}
                            </span>
                          </div>
                          <p className="text-xs text-navy-600/50 line-clamp-2">{q.message || 'No message'}</p>
                        </div>
                        <span className="text-[11px] text-navy-500/40 whitespace-nowrap shrink-0">
                          {q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm p-8">
              <h2 className="font-display text-lg font-bold text-navy-900 mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className={inputClass}
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    required
                    minLength={8}
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className={inputClass}
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    className={inputClass}
                    autoComplete="new-password"
                  />
                </div>

                {pwError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{pwError}</div>
                )}
                {pwSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">Password changed successfully.</div>
                )}

                <button
                  type="submit"
                  disabled={pwSaving}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pwSaving ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
