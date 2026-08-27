import React from 'react';
import { NavTab } from './Navbar';
import { 
  Calendar, 
  Calculator, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Activity, 
  Users,
  User
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
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'My Peptides', icon: <Calendar className="w-5 h-5" /> },
    { id: 'calculator', label: 'Calc', icon: <Calculator className="w-5 h-5" /> },
    { id: 'library', label: 'Library', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'matcher', label: 'Matcher', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'protocols', label: 'Protocols', icon: <Layers className="w-5 h-5" />, badge: activeProtocolsCount },
    { id: 'journal', label: 'Journal', icon: <Activity className="w-5 h-5" /> },
    { id: 'community', label: 'Hub', icon: <Users className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-start sm:justify-around overflow-x-auto scrollbar-none gap-2 pb-1 pt-1">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 min-w-[72px] shrink-0 rounded-xl transition relative ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-semibold uppercase tracking-widest mt-1 whitespace-nowrap">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-cyan-400"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
