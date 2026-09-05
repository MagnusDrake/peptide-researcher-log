import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Calculator, 
  BookOpen, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  User, 
  Download, 
  Sun, 
  Moon, 
  Lock, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight
} from 'lucide-react';

export type NavTab = 'dashboard' | 'calculator' | 'library' | 'matcher' | 'community' | 'sources' | 'profile';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  // Primary Tools (Directly in main header)
  const primaryNavItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'My Peptides', icon: <Calendar className="w-4 h-4" />, badge: activeProtocolsCount },
    { id: 'calculator', label: 'Mix Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'library', label: 'Peptide Guide', icon: <BookOpen className="w-4 h-4" /> },
  ];

  // Secondary Tools (Extracted into Collapsible Sidebar & Profile Dropdown)
  const secondaryNavItems: { id: NavTab; label: string; subtitle: string; icon: React.ReactNode }[] = [
    { id: 'matcher', label: 'Goal Matcher', subtitle: 'Targeted stack recommender', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
    { id: 'community', label: 'Community Hub', subtitle: 'Live Reddit streams & peer Q&A', icon: <Users className="w-4 h-4 text-purple-400" /> },
    { id: 'sources', label: 'Verified Sources', subtitle: '3rd-party tested suppliers', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'profile', label: 'My Profile & Vault', subtitle: 'Security PIN & data backups', icon: <User className="w-4 h-4 text-cyan-300" /> },
  ];

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileDrawerOpen(false);
        triggerButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen || isMobileDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isMobileDrawerOpen]);

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    setIsDropdownOpen(false);
    setIsMobileDrawerOpen(false);
  };

  const isSecondaryActive = secondaryNavItems.some(item => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3.5 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => handleSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl p-1"
          tabIndex={0}
          role="button"
          aria-label="Aura Peptides Home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelectTab('dashboard');
            }
          }}
        >
          <div className="relative w-8 h-8 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
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

        {/* Primary Desktop Navigation Links */}
        <nav 
          aria-label="Primary Navigation" 
          className="hidden md:flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner"
        >
          {primaryNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[0.65rem] font-semibold uppercase tracking-widest transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-cyan-950 text-cyan-200 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Secondary Navigation (Profile & More Tools Dropdown) + Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0" ref={dropdownRef}>
          
          {/* User Profile & Secondary Tools Dropdown Button (Desktop) */}
          <div className="relative hidden md:block">
            <button
              ref={triggerButtonRef}
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition cursor-pointer text-xs font-semibold ${
                isSecondaryActive || isDropdownOpen
                  ? 'bg-slate-800 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <User className="w-3 h-3" />
              </div>
              <span className="text-[0.65rem] uppercase tracking-wider font-bold">More & Vault</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {/* Desktop Dropdown Menu - Explicit 100% Solid Opaque Background */}
            {isDropdownOpen && (
              <div className="vault-dropdown-menu absolute right-0 mt-2 w-72 rounded-3xl p-2.5 shadow-2xl flex flex-col gap-1 z-50 opacity-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="dropdown-header px-3 py-2 flex items-center justify-between">
                  <span className="dropdown-header-title text-[10px] font-bold uppercase tracking-widest">Secondary Modules</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono border border-emerald-500/20 font-bold">
                    Vault Encrypted
                  </span>
                </div>

                {secondaryNavItems.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`dropdown-item w-full flex items-center justify-between p-2.5 rounded-2xl transition cursor-pointer text-left ${
                        isActive ? 'active-module' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="dropdown-icon-box p-2 rounded-xl border">
                          {item.icon}
                        </div>
                        <div>
                          <div className="dropdown-item-title text-xs font-bold leading-tight">{item.label}</div>
                          <div className="dropdown-item-subtitle text-[10px]">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="dropdown-arrow w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition active:scale-95 shadow-sm cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600" />
            )}
          </button>

          {/* Lock Secure Terminal */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center w-9 h-9 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 transition active:scale-95 shadow-sm cursor-pointer"
              title="Lock Secure Terminal"
              aria-label="Lock Secure Terminal"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* Install PWA Button */}
          {canInstall && (
            <button
              onClick={onInstallClick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Mobile Drawer Menu Trigger (Hamburger) */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Open Secondary Menu"
            aria-expanded={isMobileDrawerOpen}
          >
            {isMobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Collapsible Sidebar / Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] z-50 bg-slate-950/95 backdrop-blur-2xl p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200 overflow-y-auto pb-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Navigation & Tools</span>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-1">Primary Tools</span>
            {primaryNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-sm font-semibold transition ${
                  activeTab === item.id
                    ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950 text-cyan-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-1">Secondary Modules</span>
            {secondaryNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-sm font-semibold transition ${
                  activeTab === item.id
                    ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div className="text-left">
                    <div>{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.subtitle}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      )}

    </header>
  );
};
