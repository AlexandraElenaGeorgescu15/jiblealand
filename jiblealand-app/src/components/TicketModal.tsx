import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Copy, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface TicketModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ user, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(user.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900 overflow-hidden">
        {/* Top Red Header Strip */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-red-600" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Închide biletul"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ticket Header */}
        <div className="text-center mt-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Acces Turnichet Activ</span>
          </div>
          <h3 className="font-display font-black text-xl text-slate-900">
            {user.ticketType}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Valabilitate: <strong className="text-slate-800">{user.validUntil}</strong>
          </p>
        </div>

        {/* Big QR Code Container */}
        <div className="bg-slate-50 p-5 rounded-2xl border-2 border-red-500/30 my-4 flex flex-col items-center justify-center shadow-inner">
          <div className="relative p-2 bg-white rounded-xl shadow-xs border border-slate-200">
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="5" width="24" height="24" rx="3" stroke="#dc2626" strokeWidth="4" />
              <rect x="11" y="11" width="12" height="12" rx="1" fill="#dc2626" />

              <rect x="71" y="5" width="24" height="24" rx="3" stroke="#dc2626" strokeWidth="4" />
              <rect x="77" y="11" width="12" height="12" rx="1" fill="#dc2626" />

              <rect x="5" y="71" width="24" height="24" rx="3" stroke="#dc2626" strokeWidth="4" />
              <rect x="11" y="77" width="12" height="12" rx="1" fill="#dc2626" />

              {/* Data pixel matrix */}
              <rect x="36" y="8" width="6" height="6" fill="#1e293b" />
              <rect x="46" y="8" width="6" height="6" fill="#dc2626" />
              <rect x="56" y="8" width="6" height="6" fill="#1e293b" />

              <rect x="36" y="18" width="6" height="6" fill="#1e293b" />
              <rect x="46" y="24" width="6" height="6" fill="#dc2626" />
              <rect x="56" y="18" width="6" height="6" fill="#1e293b" />

              <rect x="8" y="36" width="6" height="6" fill="#1e293b" />
              <rect x="18" y="36" width="6" height="6" fill="#1e293b" />
              <rect x="28" y="36" width="6" height="6" fill="#dc2626" />
              <rect x="38" y="36" width="6" height="6" fill="#1e293b" />
              <rect x="48" y="36" width="6" height="6" fill="#dc2626" />
              <rect x="58" y="36" width="6" height="6" fill="#1e293b" />
              <rect x="68" y="36" width="6" height="6" fill="#1e293b" />
              <rect x="78" y="36" width="6" height="6" fill="#dc2626" />
              <rect x="88" y="36" width="6" height="6" fill="#1e293b" />

              <rect x="8" y="46" width="6" height="6" fill="#1e293b" />
              <rect x="22" y="46" width="6" height="6" fill="#dc2626" />
              <rect x="36" y="46" width="6" height="6" fill="#1e293b" />
              <rect x="50" y="46" width="6" height="6" fill="#dc2626" />
              <rect x="64" y="46" width="6" height="6" fill="#1e293b" />
              <rect x="78" y="46" width="6" height="6" fill="#dc2626" />

              <rect x="8" y="56" width="6" height="6" fill="#1e293b" />
              <rect x="18" y="56" width="6" height="6" fill="#dc2626" />
              <rect x="38" y="56" width="6" height="6" fill="#1e293b" />
              <rect x="48" y="56" width="6" height="6" fill="#1e293b" />
              <rect x="58" y="56" width="6" height="6" fill="#dc2626" />
              <rect x="78" y="56" width="6" height="6" fill="#1e293b" />

              <rect x="36" y="68" width="6" height="6" fill="#dc2626" />
              <rect x="46" y="68" width="6" height="6" fill="#1e293b" />
              <rect x="56" y="68" width="6" height="6" fill="#1e293b" />
              <rect x="68" y="68" width="6" height="6" fill="#dc2626" />
              <rect x="78" y="68" width="6" height="6" fill="#1e293b" />
              <rect x="88" y="68" width="6" height="6" fill="#dc2626" />

              <rect x="36" y="78" width="6" height="6" fill="#1e293b" />
              <rect x="46" y="78" width="6" height="6" fill="#dc2626" />
              <rect x="68" y="78" width="6" height="6" fill="#1e293b" />
              <rect x="88" y="78" width="6" height="6" fill="#1e293b" />

              <rect x="36" y="88" width="6" height="6" fill="#dc2626" />
              <rect x="56" y="88" width="6" height="6" fill="#1e293b" />
              <rect x="78" y="88" width="6" height="6" fill="#dc2626" />
            </svg>

            {/* Center emblem */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-red-600 border-2 border-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <p className="text-xs font-mono tracking-widest text-slate-700 mt-3 font-extrabold">
            {user.ticketNumber}
          </p>
        </div>

        {/* Details list */}
        <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center">
            <span>Titular:</span>
            <span className="font-bold text-slate-900">{user.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Fast-Pass Incluse:</span>
            <span className="font-bold text-red-600">{user.fastPassCount} rămase</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Stare Autentificare:</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="w-4 h-4" /> Semnătură Digitală Validă
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copiat!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copiază Cod</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
};
