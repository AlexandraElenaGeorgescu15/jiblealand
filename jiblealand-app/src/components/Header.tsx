import React from 'react';
import { Sparkles, Coins, Plus, Home, Compass, User, LogIn } from 'lucide-react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  balance: number;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenTopUp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  activeTab,
  onChangeTab,
  onOpenTopUp,
}) => {
  const { currentUser, isSignedIn, openGoogleModal } = useAuth();

  const navItems = [
    { id: 'home' as TabType, label: 'Acasă', icon: Home },
    { id: 'map' as TabType, label: 'Hartă & Cozi', icon: Compass },
    { id: 'profile' as TabType, label: 'Profil & Sold', icon: User },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <button
          onClick={() => onChangeTab('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-tight text-slate-900 leading-none block">
              Jiblealand<span className="text-red-600">.</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Parc de Distracții</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Google Profile & JibleCoins */}
        <div className="flex items-center gap-2">
          {/* Google User Button */}
          <button
            onClick={openGoogleModal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            title={isSignedIn ? `Conectat ca ${currentUser?.name}` : 'Conectare cu Google'}
          >
            {isSignedIn && currentUser ? (
              <>
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-red-500"
                />
                <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[120px] truncate">
                  {currentUser.givenName}
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-slate-700">Google</span>
              </>
            )}
          </button>

          {/* JibleCoins Pill */}
          <button
            onClick={onOpenTopUp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100/80 border border-red-200 text-slate-900 shadow-xs transition-transform active:scale-95 cursor-pointer"
            aria-label="Sold JibleCoins"
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="font-extrabold text-xs text-red-700 tabular-nums">
              {balance}
            </span>
            <span className="text-[10px] font-bold text-slate-400">JC</span>
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 text-white flex items-center justify-center ml-0.5">
              <Plus className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
