import React from 'react';
import { NavTab } from './Navbar';
import { 
  Calendar, 
  Calculator, 
  BookOpen, 
  User,
  Sparkles,
  Users
} from 'lucide-react';

interface MobileNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeProtocolsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  activeProtocolsCount,
}) => {
  const primaryMobileItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'My Peptides', icon: <Calendar className="w-5 h-5" />, badge: activeProtocolsCount },
    { id: 'calculator', label: 'Mix Calc', icon: <Calculator className="w-5 h-5" /> },
    { id: 'library', label: 'Guide', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-5 h-5" /> },
    { id: 'profile', label: 'Vault', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1.5 shadow-2xl safe-area-bottom"
    >
      <div className="flex items-center justify-around gap-1">
        {primaryMobileItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition relative min-w-[58px] cursor-pointer ${
                isActive 
                  ? 'text-cyan-400 bg-cyan-500/10 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950"></span>
                )}
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wider mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
