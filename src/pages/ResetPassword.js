import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, #1e3a5f, transparent)' }}
      />
      <div className="absolute top-20 right-20 w-48 h-48 border border-gold-500/10 rounded-full" />
      <div className="absolute bottom-32 left-16 w-28 h-28 border border-gold-500/5 rounded-full" />

      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6 2 10c0 2.5 1.5 4.5 3 6v4l3-2c1.2.6 2.6 1 4 1s2.8-.4 4-1l3 2v-4c1.5-1.5 3-3.5 3-6 0-4-4.48-8-10-8z" />
                <circle cx="12" cy="10" r="2" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-display text-lg font-bold text-white leading-tight">Coal City</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-gold-400 font-semibold">Jacuzzi & Plumbing</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
          <div className="p-8">
            <h1 className="font-display text-2xl font-bold text-navy-900 tracking-tight">Reset password</h1>
            <p className="mt-1 text-sm text-navy-600/60">Enter your new password</p>

            {success ? (
              <div className="mt-7">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  Your password has been reset successfully.
                </div>
                <Link
                  to="/login"
                  className="mt-5 inline-block w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950 font-semibold text-sm tracking-wide text-center hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400/50 hover:text-navy-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-navy-900 text-sm placeholder:text-navy-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950 font-semibold text-sm tracking-wide hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-navy-600/50">
              Remember your password?{' '}
              <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/20">
          &copy; {new Date().getFullYear()} Coal City Jacuzzi & Plumbing Supplies
        </p>
      </div>
    </div>
  );
}
