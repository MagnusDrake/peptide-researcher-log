import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Sparkles, 
  Calculator, 
  Calendar, 
  ShieldCheck, 
  FlaskConical, 
  Activity, 
  CheckCircle2, 
  KeyRound, 
  ChevronRight 
} from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const savedPin = localStorage.getItem('aura_pin');
  const CORRECT_PIN = savedPin || '0000';
  const isDefaultPin = !savedPin || savedPin === '0000';

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        setUnlocked(true);
        setTimeout(() => {
          onUnlock();
        }, 800);
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    }
  }, [pin, CORRECT_PIN, onUnlock]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (unlocked) return;
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlocked, pin]);

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

  const handleQuickUnlock = () => {
    if (isDefaultPin) {
      setPin('0000');
    }
  };

  return (
    <div className={`lock-screen-container fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-10 transition-all duration-[800ms] ease-out ${
      unlocked 
        ? 'opacity-0 scale-105 pointer-events-none blur-md' 
        : 'opacity-100 bg-slate-950/90 backdrop-blur-2xl'
    }`}>
      
      {/* Centered Luxury Welcome Container */}
      <div className={`relative z-10 w-full max-w-6xl my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-all duration-700 ${
        unlocked ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        
        {/* LEFT COLUMN: Welcome & App Overview (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 flex items-center justify-center text-cyan-400 shrink-0">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-pulse-subtle blur-lg"></div>
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="60 10" className="animate-[spin_20s_linear_infinite]" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="30 5" className="animate-[spin_15s_linear_infinite_reverse]" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-light tracking-[0.25em] text-white">AURA</h1>
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 tracking-wider">
                  PEPTIDE VAULT
                </span>
              </div>
              <p className="text-[10px] text-cyan-400 uppercase tracking-[0.22em] font-bold mt-0.5">
                Precision Peptide Tracking & Protocol Suite
              </p>
            </div>
          </div>

          {/* Core Introduction */}
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 tracking-tight leading-tight">
              Master Your Protocols with Zero Guesswork.
            </h2>
            <p className="text-sm text-slate-300 mt-2.5 leading-relaxed max-w-2xl">
              Aura is an offline-first research companion designed to eliminate dosing errors, organize complex compound schedules, calculate multi-peptide blends, and record your biometric progress in complete privacy.
            </p>
          </div>

          {/* 4 Key Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
            
            {/* Pillar 1: Calculators */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 hover:border-cyan-500/40 transition-colors shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Compounding & Syringes</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Reconstitution math, multi-peptide blends, and exact visual syringe tick marks (U-100, U-50, U-30).
                </p>
              </div>
            </div>

            {/* Pillar 2: Daily Schedule */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 hover:border-emerald-500/40 transition-colors shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Schedule & Site Rotation</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Automated daily dose checklist, anatomical injection site mapping, and active half-life curves.
                </p>
              </div>
            </div>

            {/* Pillar 3: Knowledge Base */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 hover:border-purple-500/40 transition-colors shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Curated Stacks & Library</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Explore goal-matched stacks for longevity, rapid healing, fat loss, cognition, and muscle retention.
                </p>
              </div>
            </div>

            {/* Pillar 4: 100% Privacy */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 hover:border-amber-500/40 transition-colors shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">100% Private & Local</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Zero cloud servers, no account tracking. All research protocols remain encrypted locally on your device.
                </p>
              </div>
            </div>

          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Progressive Web App • Offline Capable • Zero Data Harvesting</span>
          </div>

        </div>

        {/* RIGHT COLUMN: 4-Digit Passcode Access Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border-slate-800/80 shadow-2xl flex flex-col items-center relative overflow-hidden">
            
            {/* Ambient Top Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Lock Card Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                {unlocked ? <Unlock className="w-6 h-6 text-emerald-400" /> : <Lock className="w-6 h-6" />}
              </div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-[0.2em]">
                {unlocked ? 'Access Granted' : 'Enter Vault Passcode'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {unlocked 
                  ? 'Decrypting and loading your local protocols...' 
                  : 'Enter your 4-digit security PIN to access the application.'}
              </p>

              {/* Default PIN Quick Helper */}
              {isDefaultPin && !unlocked && (
                <button
                  type="button"
                  onClick={handleQuickUnlock}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-semibold transition cursor-pointer"
                >
                  <KeyRound className="w-3 h-3 text-cyan-400" />
                  <span>Default Passcode: <strong>0000</strong> (Tap to Auto-Enter)</span>
                </button>
              )}
            </div>

            {/* PIN Indicators */}
            <div className={`flex gap-4 mb-6 transition-transform ${error ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                    pin.length > i 
                      ? unlocked 
                        ? 'bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)] border-emerald-400 scale-110' 
                        : error 
                          ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] border-rose-500 scale-110' 
                          : 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] border-cyan-400 scale-110' 
                      : 'bg-slate-900 border-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Interactive Keypad */}
            <div className="grid grid-cols-3 gap-y-3.5 gap-x-5 w-full max-w-[280px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num.toString())}
                  className="h-14 rounded-2xl flex items-center justify-center text-xl font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 active:scale-95 transition-all duration-150 shadow-md focus:outline-none"
                >
                  {num}
                </button>
              ))}
              
              <div className="flex items-center justify-center">
                <span className="text-[10px] font-mono text-slate-600 font-bold uppercase">PIN</span>
              </div>
              
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-14 rounded-2xl flex items-center justify-center text-xl font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 active:scale-95 transition-all duration-150 shadow-md focus:outline-none"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/30 active:scale-95 transition-all duration-150 shadow-md focus:outline-none"
                title="Delete digit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 4-10 0-7 8 7 8 10 0a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><path d="m18 9-6 6"/><path d="m12 9 6 6"/></svg>
              </button>
            </div>

            {/* Footer / Status */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 w-full text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>Encrypted Client-Side Storage</span>
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
