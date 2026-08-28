import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lock, Unlock } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const CORRECT_PIN = localStorage.getItem('aura_pin') || '0000';

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        setUnlocked(true);
        setTimeout(() => {
          onUnlock();
        }, 1000);
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, onUnlock]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4 && !unlocked) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    if (!unlocked) {
      setPin(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-[1000ms] ease-out ${unlocked ? 'opacity-0 scale-110 pointer-events-none blur-md' : 'opacity-100 bg-slate-950/80 backdrop-blur-3xl'}`}>
      
      <div className={`relative z-10 w-full max-w-sm p-8 flex flex-col items-center transition-all duration-700 ${unlocked ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
        
        {/* Aura Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="relative w-20 h-20 flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-pulse-subtle blur-xl"></div>
            <svg viewBox="0 0 100 100" className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="60 10" className="animate-[spin_20s_linear_infinite]" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="30 5" className="animate-[spin_15s_linear_infinite_reverse]" />
              <circle cx="50" cy="50" r="12" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-[2rem] font-light tracking-[0.3em] text-slate-100 mb-2 ml-2">AURA</h1>
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-cyan-400/80 font-medium">Peptide tracking made easy.</p>
          <p className="text-[0.55rem] uppercase tracking-[0.5em] text-slate-500 font-bold mt-3 ml-1">PEPTIDES</p>
        </div>

        {/* PIN Indicators */}
        <div className={`flex gap-6 mb-12 transition-transform ${error ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                pin.length > i 
                  ? unlocked 
                    ? 'bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)] border-emerald-400' 
                    : error 
                      ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] border-rose-500'
                      : 'bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] border-cyan-400' 
                  : 'bg-transparent border-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-y-6 gap-x-8 w-full max-w-[280px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-16 w-16 mx-auto rounded-full flex items-center justify-center text-2xl font-light text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50 border border-transparent hover:border-cyan-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress('0')}
            className="h-16 w-16 mx-auto rounded-full flex items-center justify-center text-2xl font-light text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50 border border-transparent hover:border-cyan-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 w-16 mx-auto rounded-full flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-slate-800/50 transition-all duration-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 4-10 0-7 8 7 8 10 0a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><path d="m18 9-6 6"/><path d="m12 9 6 6"/></svg>
          </button>
        </div>

        {/* Status Text */}
        <div className="mt-12 h-6 flex items-center justify-center">
          {unlocked ? (
            <div className="flex items-center text-emerald-400 text-xs tracking-widest uppercase font-medium animate-pulse">
              <Unlock className="w-3.5 h-3.5 mr-2" /> Decrypting Vault...
            </div>
          ) : (
            <div className="flex items-center text-slate-600 text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
              <Lock className="w-3 h-3 mr-2" /> Secure Terminal
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
