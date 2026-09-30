import React, { useState } from 'react';
import { X, Coins, CreditCard } from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onAddFunds: (amount: number, description: string) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onAddFunds,
}) => {
  const [selectedPack, setSelectedPack] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const packs = [
    { coins: 50, price: '25 RON', bonus: null, label: 'Pachet Starter' },
    { coins: 100, price: '45 RON', bonus: '+10 JC Bonus', label: 'Cel Mai Popular', popular: true },
    { coins: 250, price: '99 RON', bonus: '+50 JC Bonus', label: 'Mega Aventura' },
  ];

  const handleTopUp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const pack = packs.find((p) => p.coins === selectedPack);
      const totalCoins = selectedPack + (selectedPack === 100 ? 10 : selectedPack === 250 ? 50 : 0);
      onAddFunds(totalCoins, `Reîncărcare Sold (${pack?.price})`);
      setIsProcessing(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 text-slate-900 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
              <Coins className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">Reîncărcare JibleCoins</h3>
              <p className="text-xs text-slate-500">Moneda oficială pentru atracții, mese și suveniruri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Închide fereastra de reîncărcare"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between mb-5">
          <span className="text-xs font-semibold text-slate-600">Sold curent în portofel:</span>
          <span className="font-display font-black text-slate-900 text-lg tabular-nums flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" />
            {currentBalance} JibleCoins
          </span>
        </div>

        {/* Packs grid */}
        <div className="space-y-3 mb-6">
          {packs.map((pack) => {
            const isSelected = selectedPack === pack.coins;
            return (
              <button
                key={pack.coins}
                onClick={() => setSelectedPack(pack.coins)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all relative cursor-pointer ${
                  isSelected
                    ? 'bg-red-50/60 border-red-500 ring-2 ring-red-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-2.5 right-4 bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    RECOMANDAT
                  </span>
                )}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display font-black text-slate-900 text-base">
                        {pack.coins} JibleCoins
                      </p>
                      {pack.bonus && (
                        <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md">
                          {pack.bonus}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{pack.label}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-black text-base text-red-600 tabular-nums">{pack.price}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Plată securizată</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pay button */}
        <button
          onClick={handleTopUp}
          disabled={isProcessing}
          className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/25 transition-all disabled:opacity-60 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Se procesează plata securizată...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Plătește și Adaugă în Sold</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
