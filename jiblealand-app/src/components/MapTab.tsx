import React, { useState } from 'react';
import {
  RefreshCw,
  Clock,
  Zap,
  Wrench,
  Activity,
} from 'lucide-react';
import { Attraction } from '../types';

interface MapTabProps {
  attractions: Attraction[];
  isMcpLoading: boolean;
  onRefreshMcp: () => void;
  lastMcpSyncTime: string | null;
  onBookFastPassFromAttraction: (attractionName: string) => void;
}

export const MapTab: React.FC<MapTabProps> = ({
  attractions,
  isMcpLoading,
  onRefreshMcp,
  lastMcpSyncTime,
  onBookFastPassFromAttraction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toate');

  const categories = ['Toate', 'Rollercoaster', 'Familie', 'Acvatic', 'Adrenalină'];

  const filteredAttractions = attractions.filter((attr) => {
    return selectedCategory === 'Toate' ? true : attr.category === selectedCategory;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* 1. Header with MCP Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Atracții & Timpi de Așteptare
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lastMcpSyncTime ? (
              <>Sincronizat live la <strong className="text-slate-800 font-mono">{lastMcpSyncTime}</strong></>
            ) : (
              'Date senzori în timp real via MCP'
            )}
          </p>
        </div>

        {/* The Mandatory MCP Button */}
        <button
          onClick={onRefreshMcp}
          disabled={isMcpLoading}
          className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-red-600/25 transition-all disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isMcpLoading ? 'animate-spin' : ''}`} />
          <span>{isMcpLoading ? 'Se actualizează MCP...' : 'Reîmprospătează Live (MCP)'}</span>
        </button>
      </div>

      {/* 2. Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Attraction List (Simple, Clear Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredAttractions.map((attr) => {
          const isMaintenance = attr.status === 'maintenance';
          const isClosed = attr.status === 'closed';

          return (
            <div
              key={attr.id}
              className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-red-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-3xl p-1 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                      {attr.thumbnail}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-extrabold text-sm text-slate-900 leading-snug">
                        {attr.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {attr.zone} · {attr.intensity}
                        {attr.heightLimitCm && ` · Min ${attr.heightLimitCm}cm`}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {attr.description}
                      </p>
                    </div>
                  </div>

                  {/* Wait time badge */}
                  <div className="shrink-0 text-right">
                    {isMaintenance ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                        <Wrench className="w-3 h-3 text-red-500" />
                        Mentenanță
                      </span>
                    ) : isClosed ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold">
                        Închis
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-black tabular-nums ${
                          attr.waitTimeMinutes <= 15
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : attr.waitTimeMinutes <= 35
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-red-50 border-red-300 text-red-800'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {attr.waitTimeMinutes} min
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fast-Pass Action */}
              {attr.fastPassAvailable && !isMaintenance && !isClosed && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-red-600 font-bold flex items-center gap-1 text-[11px]">
                    <Zap className="w-3 h-3 fill-red-600" />
                    Fast-Pass disponibil
                  </span>
                  <button
                    onClick={() => onBookFastPassFromAttraction(attr.name)}
                    className="py-1 px-2.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Rezervă Slot
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
