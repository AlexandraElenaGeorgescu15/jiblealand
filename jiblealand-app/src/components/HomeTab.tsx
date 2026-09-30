import React from 'react';
import {
  Sparkles,
  Zap,
  Coins,
  QrCode,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Clock,
  Calendar,
} from 'lucide-react';
import { UserProfile, Attraction } from '../types';
import { useAuth } from '../context/AuthContext';

interface HomeTabProps {
  user: UserProfile;
  attractions: Attraction[];
  onOpenFastPass: () => void;
  onOpenTopUp: () => void;
  onOpenTicket: () => void;
  onGoToMap: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  attractions,
  onOpenFastPass,
  onOpenTopUp,
  onOpenTicket,
  onGoToMap,
}) => {
  const { currentUser, isSignedIn } = useAuth();
  const displayName = isSignedIn && currentUser ? currentUser.givenName : user.name.split(' ')[0];

  const activeAttractions = attractions.filter(
    (a) => a.status !== 'maintenance' && a.status !== 'closed'
  );
  const lowestWait = [...activeAttractions].sort(
    (a, b) => a.waitTimeMinutes - b.waitTimeMinutes
  )[0];

  return (
    <div className="space-y-5 pb-6">
      {/* 1. Welcome Greeting Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white shadow-md shadow-red-600/10 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Jiblealand Magic</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
            Salut, {displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-red-100 mt-0.5">
            Parcul este deschis astăzi până la 23:00
          </p>
        </div>
      </div>

      {/* 2. Central Digital Ticket Card ("Biletul tău") */}
      <div className="relative">
        <button
          onClick={onOpenTicket}
          className="w-full text-left rounded-3xl bg-white border-2 border-red-200 hover:border-red-500 p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer group"
          aria-label="Deschide biletul tău digital"
        >
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="text-xs font-black tracking-wider text-red-700 uppercase">
                BILETUL TĂU
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
              {user.ticketNumber}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
            {/* Clean QR Graphic */}
            <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-xs border-2 border-red-500/30 flex items-center justify-center shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <rect x="5" y="5" width="26" height="26" rx="2" stroke="#dc2626" strokeWidth="4" />
                <rect x="12" y="12" width="12" height="12" fill="#dc2626" />
                <rect x="69" y="5" width="26" height="26" rx="2" stroke="#dc2626" strokeWidth="4" />
                <rect x="76" y="12" width="12" height="12" fill="#dc2626" />
                <rect x="5" y="69" width="26" height="26" rx="2" stroke="#dc2626" strokeWidth="4" />
                <rect x="12" y="76" width="12" height="12" fill="#dc2626" />
                <rect x="38" y="10" width="8" height="8" fill="#1e293b" />
                <rect x="50" y="20" width="8" height="8" fill="#dc2626" />
                <rect x="38" y="38" width="8" height="8" fill="#1e293b" />
                <rect x="50" y="50" width="8" height="8" fill="#dc2626" />
                <rect x="20" y="45" width="8" height="8" fill="#1e293b" />
                <rect x="70" y="45" width="8" height="8" fill="#dc2626" />
                <rect x="42" y="72" width="8" height="8" fill="#1e293b" />
                <rect x="75" y="72" width="8" height="8" fill="#dc2626" />
              </svg>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-snug">
                {user.ticketType}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Acces turnichet valid</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Valabil: <strong className="text-slate-800">{user.validUntil}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <QrCode className="w-4 h-4 text-red-600" />
              Apasă pentru scanare mărită
            </span>
            <span className="font-extrabold text-red-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Deschide <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>
      </div>

      {/* 3. Fast-Pass & Încărcare Sold Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Fast-Pass */}
        <button
          onClick={onOpenFastPass}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-red-400 text-left shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group"
          aria-label="Fast-Pass"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200">
              {user.fastPassCount} rămase
            </span>
          </div>
          <h3 className="font-display font-black text-base text-slate-900">
            Fast-Pass
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Rezervă intrare prioritară la atracții fără coadă
          </p>
        </button>

        {/* Încărcare Sold */}
        <button
          onClick={onOpenTopUp}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-red-400 text-left shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group"
          aria-label="Încarcă sold"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Coins className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
              {user.balance} JC
            </span>
          </div>
          <h3 className="font-display font-black text-base text-slate-900">
            Încărcare Sold
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Adaugă JibleCoins pentru restaurante și suveniruri
          </p>
        </button>
      </div>

      {/* 4. Simple Park Pulse & Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lowestWait && (
          <div
            onClick={onGoToMap}
            className="cursor-pointer p-4 rounded-3xl bg-white border border-slate-200 hover:border-red-300 flex items-center justify-between transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lowestWait.thumbnail}</span>
              <div>
                <p className="text-xs font-bold text-slate-900">{lowestWait.name}</p>
                <p className="text-[11px] text-slate-500">Cea mai mică coadă acum</p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black">
              {lowestWait.waitTimeMinutes} min
            </div>
          </div>
        )}

        <div className="p-4 rounded-3xl bg-red-50/70 border border-red-200 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-red-600 shrink-0" />
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-bold text-slate-900">Spectacolul Dragonului de Foc</p>
            <p className="text-slate-500">Diseară la ora 21:00 la Amfiteatru</p>
          </div>
        </div>
      </div>
    </div>
  );
};
