import React from 'react';
import { 
  Calendar, 
  Calculator, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Activity, 
  Users, 
  Download, 
  Sun, 
  Moon,
  Lock,
  User 
} from 'lucide-react';

export type NavTab = 'dashboard' | 'calculator' | 'library' | 'matcher' | 'community' | 'profile';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeProtocolsCount: number;
  onInstallClick?: () => void;
  canInstall?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  activeProtocolsCount,
  onInstallClick,
  canInstall = false,
  theme,
  onToggleTheme,
  onLogout,
}) => {

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'My Peptides', icon: <Calendar className="w-4 h-4" />, badge: activeProtocolsCount },
    { id: 'calculator', label: 'Mix Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'library', label: 'Peptide Guide', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'matcher', label: 'Goal Matcher', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          {/* Minimal Aura Logo SVG */}
          <div className="relative w-8 h-8 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="60 10" className="group-hover:animate-[spin_4s_linear_infinite]" />
              <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="5" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-light text-slate-100 tracking-[0.2em] flex items-center gap-2">
              <span>AURA</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20 tracking-wider">
                PEPTIDES
              </span>
            </div>
            <div className="text-[9px] text-cyan-400 uppercase tracking-[0.2em] font-bold mt-0.5">Daily Peptide Tracker</div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[0.65rem] font-semibold uppercase tracking-widest transition relative ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-cyan-950 text-cyan-200' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Status Badges & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Lock Secure Terminal */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 transition active:scale-95 shadow-sm"
              title="Lock Secure Terminal"
              aria-label="Lock Secure Terminal"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition active:scale-95 shadow-sm"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600" />
            )}
          </button>

          {/* Install PWA Button */}
          {canInstall && (
            <button
              onClick={onInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 btn-glow-cyan hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden">Install</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
