import React from 'react';
import { NavTab } from './Navbar';
import { 
  ShieldCheck, 
  ExternalLink, 
  Beaker, 
  CheckCircle2, 
  BookOpen, 
  Calculator, 
  Calendar, 
  Users, 
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, onTabChange }) => {
  return (
    <footer className="w-full bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-xl mt-auto pt-10 pb-24 md:pb-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Featured Verified Supplier Banner */}
        <div className="relative group rounded-3xl overflow-hidden p-[1px] bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-teal-500/30 shadow-xl shadow-emerald-500/5">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-[23px] p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Supplier Info & Trust Badges */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-400">
                    Verified Peptide Supplier
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    3rd-Party HPLC Tested
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Looking for trusted, high-purity research compounds?
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                  Amino Club provides batch-specific COAs with 99%+ purity verification. Use partner code <span className="text-cyan-300 font-mono font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">AURAPEPTIDES</span> at checkout.
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => onTabChange('sources')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition active:scale-95 cursor-pointer"
              >
                <Beaker className="w-3.5 h-3.5 text-cyan-400" />
                <span>All Verified Sources</span>
              </button>

              <a
                href="https://aminoclub.com?utm_source=affiliate_marketing&code=AURAPEPTIDES"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition active:scale-95 cursor-pointer"
              >
                <span>Visit Amino Club</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

        {/* Secondary Links & Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4 border-t border-slate-800/60">
          
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <div 
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="relative w-6 h-6 flex items-center justify-center text-cyan-400">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="60 10" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="6" />
                  <circle cx="50" cy="50" r="8" fill="currentColor" />
                </svg>
              </div>
              <span className="text-sm font-light text-slate-100 tracking-[0.2em] font-sans">
                AURA <span className="text-[8px] text-cyan-400 font-bold ml-1">PEPTIDES</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precision dosage calculations, reconstitution modeling, and pharmacokinetics tracking for independent peptide researchers.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>100% Client-Side Encrypted Storage</span>
            </div>
          </div>

          {/* Col 2: Core Tools */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">
              Core Calculators
            </span>
            <ul className="flex flex-col gap-2 text-xs text-slate-300">
              <li>
                <button 
                  type="button"
                  onClick={() => onTabChange('dashboard')} 
                  className={`hover:text-cyan-400 transition text-left cursor-pointer flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'text-cyan-400 font-semibold' : ''}`}
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Daily Schedule & Log</span>
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onTabChange('calculator')} 
                  className={`hover:text-cyan-400 transition text-left cursor-pointer flex items-center gap-1.5 ${activeTab === 'calculator' ? 'text-cyan-400 font-semibold' : ''}`}
                >
                  <Calculator className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reconstitution Calculator</span>
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onTabChange('calculator')} 
                  className="hover:text-cyan-400 transition text-left cursor-pointer flex items-center gap-1.5 text-slate-400"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                  <span>Multi-Peptide Blend Calculator</span>
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onTabChange('calculator')} 
                  className="hover:text-cyan-400 transition text-left cursor-pointer flex items-center gap-1.5 text-slate-400"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Dose Ramp-Up & Titration</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Sourcing */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">
              Knowledge & Sourcing
            </span>
            <ul className="flex flex-col gap-2 text-xs text-slate-300">
              <li>
                <button 
                  type="button"
                  onClick={() => onTabChange('library')} 
                  className={`hover:text-cyan-400 transition text-left cursor-pointer flex items-center gap-1.5 ${activeTab === 'library' ? 'text-cyan-400 font-semibold' : ''}`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Peptide Guide & Monograph Directory</span>
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onTabChange('sources')} 
                  className={`hover:text-emerald-400 transition text-left cursor-pointer flex items-center gap-1.5 ${activeTab === 'sources' ? 'text-emerald-400 font-bold' : 'text-emerald-300'}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified 3rd-Party Tested Sources</span>
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onTabChange('community')} 
                  className={`hover:text-cyan-400 transition text-left cursor-pointer flex items-center gap-1.5 ${activeTab === 'community' ? 'text-cyan-400 font-semibold' : ''}`}
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Peer Community & Live Q&A</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Disclaimer */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">
              Research Disclaimer
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Aura is an educational tracking and dosage calculation tool designed strictly for research modeling and harm reduction. Information is not medical advice. Reconstitute only with sterile bacteriostatic water.
            </p>
            <div className="mt-1">
              <button
                type="button"
                onClick={() => onTabChange('profile')}
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-cyan-300 transition cursor-pointer"
              >
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>Vault Security & Backups</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/40 text-[10px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Aura Peptides Researcher Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Offline-First Progressive Web App (PWA)</span>
            <span>•</span>
            <button 
              type="button"
              onClick={() => onTabChange('sources')}
              className="text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              Verified Supplier Directory
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
