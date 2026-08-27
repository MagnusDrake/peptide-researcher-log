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
  Moon 
} from 'lucide-react';

export type NavTab = 'dashboard' | 'calculator' | 'library' | 'matcher' | 'protocols' | 'journal' | 'community';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeProtocolsCount: number;
  onInstallClick?: () => void;
  canInstall?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  activeProtocolsCount,
  onInstallClick,
  canInstall = false,
  theme,
  onToggleTheme,
}) => {

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'My Peptides', icon: <Calendar className="w-4 h-4" /> },
    { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'library', label: 'Peptide DB', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'matcher', label: 'Matcher Quiz', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'protocols', label: 'Protocols', icon: <Layers className="w-4 h-4" />, badge: activeProtocolsCount },
    { id: 'journal', label: 'Journal & Logs', icon: <Activity className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition btn-glow-cyan">
            <span className="text-xl font-bold">🧪</span>
          </div>
          <div>
            <div className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
              <span>Peptide<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Log</span></span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                PWA
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Research Log & Calculator</div>
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition relative ${
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
