import React, { useState } from 'react';
import { X, ShieldCheck, Check, Sparkles, LogOut, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth, ACTIVE_GOOGLE_USER } from '../context/AuthContext';

export const GoogleSignInModal: React.FC = () => {
  const {
    currentUser,
    isSignedIn,
    signInWithActiveGoogleSession,
    signInWithGoogleAccount,
    signOut,
    isGoogleModalOpen,
    closeGoogleModal,
  } = useAuth();

  const [isManualEmail, setIsManualEmail] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isGoogleModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) return;
    signInWithGoogleAccount(customEmail, customName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={closeGoogleModal}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Închide fereastra de autentificare"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mt-2 mb-6">
          {/* Official Google G Logo */}
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center mb-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>

          <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
            Autentificare cu Google
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Conectează-te pentru a sincroniza biletele, soldul JibleCoins și rezervările Fast-Pass
          </p>
        </div>

        {/* Case 1: Already Signed In */}
        {isSignedIn && currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
              <img
                src={currentUser.picture}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full border-2 border-red-500/40 object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm text-slate-900 truncate">{currentUser.name}</p>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    Activ
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  Sesiune Google verificată · {currentUser.lastLoginAt}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  signOut();
                }}
                className="flex-1 py-3 px-4 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Deconectare</span>
              </button>
              <button
                onClick={closeGoogleModal}
                className="flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                <span>Continuă în Aplicație</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Case 2: Sign In Options */
          <div className="space-y-4">
            {/* Primary Action: Direct Sign in with active Google session */}
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-red-700 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-red-600" />
                  Sesiune Activă Detectată
                </span>
                <span className="text-[10px] text-slate-400">Google One-Tap</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={ACTIVE_GOOGLE_USER.picture}
                  alt={ACTIVE_GOOGLE_USER.name}
                  className="w-11 h-11 rounded-full border border-red-300 object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {ACTIVE_GOOGLE_USER.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{ACTIVE_GOOGLE_USER.email}</p>
                </div>
              </div>

              <button
                onClick={signInWithActiveGoogleSession}
                className="w-full mt-3.5 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/25 transition-all cursor-pointer"
              >
                <span>Conectează-te ca {ACTIVE_GOOGLE_USER.givenName}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] text-slate-400 font-medium">sau</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Custom Google account toggle */}
            {!isManualEmail ? (
              <button
                onClick={() => setIsManualEmail(true)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-slate-500" />
                <span>Folosește un alt cont Google</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nume și Prenume:
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="ex. Maria Ionescu"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresă email Google:
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="nume@gmail.com"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsManualEmail(false)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20"
                  >
                    Confirmă Conectarea
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Autentificare conform standardului Google OAuth 2.0 & GIS</span>
        </div>
      </div>
    </div>
  );
};
