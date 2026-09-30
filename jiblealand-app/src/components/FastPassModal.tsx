import React, { useState } from 'react';
import { X, Zap, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Attraction } from '../types';

interface FastPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  attractions: Attraction[];
  fastPassCount: number;
  onBookFastPass: (attractionName: string, timeSlot: string) => void;
}

export const FastPassModal: React.FC<FastPassModalProps> = ({
  isOpen,
  onClose,
  attractions,
  fastPassCount,
  onBookFastPass,
}) => {
  const eligibleAttractions = attractions.filter(
    (a) => a.fastPassAvailable && a.status !== 'maintenance' && a.status !== 'closed'
  );

  const [selectedAttractionId, setSelectedAttractionId] = useState<string>(
    eligibleAttractions[0]?.id || ''
  );
  const [selectedSlot, setSelectedSlot] = useState<string>('16:15 - 16:45');

  if (!isOpen) return null;

  const timeSlots = [
    '15:30 - 16:00',
    '16:15 - 16:45',
    '17:00 - 17:30',
    '18:00 - 18:30',
    '19:15 - 19:45',
  ];

  const handleConfirm = () => {
    const attr = attractions.find((a) => a.id === selectedAttractionId);
    if (!attr) return;
    onBookFastPass(attr.name, selectedSlot);
    onClose();
  };

  const selectedAttr = attractions.find((a) => a.id === selectedAttractionId);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 text-slate-900 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black shadow-xs">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">Rezervare Fast-Pass</h3>
              <p className="text-xs text-slate-500">Banda prioritară turnichet fără coadă</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Închide fereastra Fast-Pass"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quota info */}
        <div className="flex items-center justify-between bg-red-50 border border-red-200 p-3.5 rounded-2xl mb-4 text-xs">
          <span className="text-slate-700 font-semibold">Pass-uri disponibile în bilet:</span>
          <span className="font-black text-red-700 text-sm">{fastPassCount} rămase</span>
        </div>

        {fastPassCount <= 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 p-3 rounded-xl mb-4 text-xs text-amber-900 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Pass-urile gratuite s-au epuizat. Rezervarea va costa 35 JibleCoins.</span>
          </div>
        )}

        {/* Step 1: Select Attraction */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            1. Alege atracția dorită:
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {eligibleAttractions.map((attr) => {
              const isSelected = attr.id === selectedAttractionId;
              return (
                <button
                  key={attr.id}
                  onClick={() => setSelectedAttractionId(attr.id)}
                  className={`w-full text-left p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50 border-red-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{attr.thumbnail}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{attr.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Timp normal la coadă: {attr.waitTimeMinutes} min
                      </p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Choose Slot */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            2. Interval orar sosire:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const isSelected = slot === selectedSlot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{slot}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedAttr}
          className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/25 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Confirmă Rezervarea Fast-Pass</span>
        </button>
      </div>
    </div>
  );
};
