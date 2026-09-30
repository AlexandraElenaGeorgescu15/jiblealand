import React from 'react';
import { Home, Compass, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, unreadCount = 0 }) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Acasă',
      icon: Home,
    },
    {
      id: 'map' as TabType,
      label: 'Hartă',
      icon: Compass,
    },
    {
      id: 'profile' as TabType,
      label: 'Profil',
      icon: User,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 max-w-md mx-auto md:hidden shadow-lg shadow-slate-900/5">
      <div className="grid grid-cols-3 h-16 items-center px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all group active:scale-95"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active glow background */}
              {isActive && (
                <div className="absolute inset-x-3 inset-y-1 bg-red-50 rounded-2xl -z-10" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-red-600 scale-110'
                      : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />

                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] font-bold tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-red-600' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Indicator dot */}
              {isActive && (
                <span className="w-1.5 h-1 rounded-full bg-red-600 mt-0.5 animate-in zoom-in-50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
