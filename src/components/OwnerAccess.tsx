import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, AlertCircle, Eye, EyeOff, X } from 'lucide-react';

interface OwnerAccessProps {
  className?: string;
}

export const OwnerAccess: React.FC<OwnerAccessProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpen = () => {
    setErrorMessage('');
    setPassword('');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPassword('');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password.trim()) {
      setErrorMessage('Please enter the owner password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/owner/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: password.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.authenticated && data.token) {
        // Store the real session token issued by the server (checked on every
        // request). There is no client-side password fallback anymore — a
        // wrong password, or no network, always fails closed.
        localStorage.setItem('mds_owner_token', data.token);
        localStorage.setItem('mds_owner_token_expires', String(Date.now() + (data.expiresInMs || 0)));
        handleClose();
        navigate('/owner-dashboard');
      } else {
        setErrorMessage(data.error || 'Incorrect owner password. Access denied.');
      }
    } catch (err) {
      setErrorMessage('Authentication service unreachable. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Distinct, Elegant 'M' Icon Button for Owner Access */}
      <button
        type="button"
        id="owner-access-trigger"
        onClick={handleOpen}
        title="Owner Dashboard Portal (Click to Open Login)"
        aria-label="Owner Dashboard Portal"
        className={`group relative inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#064946] hover:bg-[#08635f] border border-[#F5A623]/50 hover:border-[#F5A623] text-white transition-all shadow-xs cursor-pointer select-none active:scale-95 ${className}`}
      >
        <span className="w-5 h-5 rounded bg-[#F5A623] text-[#033B39] font-black text-xs flex items-center justify-center font-mono shadow-xs group-hover:scale-110 transition-transform">
          M
        </span>
        <span className="text-[11px] font-semibold text-white/90 group-hover:text-[#F5A623] transition-colors">
          Owner Portal
        </span>
        <Lock className="w-3 h-3 text-[#F5A623]/80 group-hover:text-[#F5A623] transition-colors" />
      </button>

      {/* Simple Secure Password Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#0B706A]/30 text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#033B39] to-[#064946] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F5A623] text-[#172222] font-mono font-bold flex items-center justify-center text-xs shadow-sm">
                  M
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide">
                    Owner Access
                  </h3>
                  <span className="text-[10px] text-white/70 block">
                    Mahnoor Digital Solution
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FBFA] border border-[#0B706A]/15 text-[11px] text-[#064946] font-medium mb-3.5">
                <Shield className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                <span>Restricted to Studio Owner</span>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-3">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#064946] uppercase tracking-wider mb-1">
                    Owner Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      required
                      placeholder="Enter owner password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#F8FBFA] border border-[#0B706A]/25 rounded-xl px-3.5 py-2.5 text-xs text-[#172222] pr-9 focus:outline-none focus:ring-2 focus:ring-[#064946]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#064946] hover:bg-[#033B39] disabled:bg-gray-400 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md cursor-pointer active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Dashboard</span>
                        <Lock className="w-3.5 h-3.5 text-[#F5A623]" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full text-center py-1 text-[11px] text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
