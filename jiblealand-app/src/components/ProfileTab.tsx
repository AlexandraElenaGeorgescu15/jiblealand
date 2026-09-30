import React, { useState } from 'react';
import {
  Coins,
  Send,
  Sparkles,
  Ticket,
  Bell,
  MessageSquare,
  Plus,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProfileTabProps {
  user: UserProfile;
  notifications: NotificationItem[];
  onOpenTopUp: () => void;
  onOpenTicket: () => void;
  onSendFeedbackToN8n: (message: string, category: string) => Promise<void>;
  isSendingFeedback: boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  notifications,
  onOpenTopUp,
  onOpenTicket,
  onSendFeedbackToN8n,
  isSendingFeedback,
}) => {
  const { currentUser, isSignedIn, openGoogleModal } = useAuth();

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('Asistență Generală');

  const categories = [
    'Asistență Generală',
    'Atracții & Cozi',
    'Probleme Tehnice',
    'Restaurante & Suveniruri',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || isSendingFeedback) return;
    await onSendFeedbackToN8n(feedbackText.trim(), feedbackCategory);
    setFeedbackText('');
  };

  const displayName = isSignedIn && currentUser ? currentUser.name : user.name;
  const displayEmail = isSignedIn && currentUser ? currentUser.email : 'alexandraelena_georgescu@trimble.com';
  const displayAvatar = isSignedIn && currentUser ? currentUser.picture : user.avatar;

  return (
    <div className="space-y-5 pb-6">
      {/* 1. User Profile & Google Account Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-14 h-14 rounded-2xl border-2 border-red-500 object-cover shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-black text-base sm:text-lg text-slate-900 leading-tight">
                {displayName}
              </h2>
              {isSignedIn && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  <UserCheck className="w-3 h-3" /> Google
                </span>
              )}
            </div>
            <p className="text-xs text-red-600 font-bold mt-0.5">{user.tier} · Nivel {user.tierLevel}</p>
            <p className="text-xs text-slate-400 mt-0.5">{displayEmail}</p>
          </div>
        </div>

        <button
          onClick={openGoogleModal}
          className="self-start sm:self-auto py-2 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          {isSignedIn ? 'Schimbă Contul Google' : 'Conectare Google'}
        </button>
      </div>

      {/* 2. Wallet & Balance Card ("250 JibleCoins") */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 to-rose-600 p-5 text-white shadow-md shadow-red-600/10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-red-100 uppercase tracking-wider">
            Soldul Tău Curent
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display font-black text-3xl tabular-nums">
              {user.balance}
            </span>
            <span className="text-sm font-bold text-red-100">JibleCoins</span>
          </div>
          <p className="text-[11px] text-red-100 mt-0.5">
            Echivalent în parc: ~{(user.balance * 0.5).toFixed(0)} RON
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onOpenTopUp}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-red-50 text-red-600 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Încarcă Sold</span>
          </button>
          <button
            onClick={onOpenTicket}
            className="py-2.5 px-3 rounded-xl bg-red-700/60 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Bilet</span>
          </button>
        </div>
      </div>

      {/* 3. SIMULARE / INTEGRATION n8n (Asistență & Feedback) */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm text-slate-900 leading-tight">
              Asistență & Feedback (n8n)
            </h3>
            <p className="text-[11px] text-slate-500">
              Trimis automat către dispeceratul parcului
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Categorie:
              </label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Mesajul tău:
              </label>
              <input
                type="text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Ai o întrebare sau nevoie de ajutor în parc?"
                required
                className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!feedbackText.trim() || isSendingFeedback}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSendingFeedback ? (
              <span>Se trimite către n8n...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Trimite Feedback / Cere Ajutor</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 4. Notificări Parc */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs">
        <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-red-600" />
          Notificări Parc ({notifications.length})
        </h4>

        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
