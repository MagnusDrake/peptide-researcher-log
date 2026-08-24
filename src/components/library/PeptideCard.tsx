import React from 'react';
import { Peptide } from '../../types';
import { Clock, Shield, Sparkles, ChevronRight, Scale } from 'lucide-react';

interface PeptideCardProps {
  peptide: Peptide;
  onSelect: (peptide: Peptide) => void;
  onCompareToggle?: (peptide: Peptide) => void;
  isCompared?: boolean;
}

export const PeptideCard: React.FC<PeptideCardProps> = ({
  peptide,
  onSelect,
  onCompareToggle,
  isCompared = false,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'healing':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'metabolic':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'gh_secretagogue':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'longevity':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'nootropic':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'cosmetic':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'immune':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
      onClick={() => onSelect(peptide)}
    >
      {/* Category Pill & Compare Checkbox */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getCategoryColor(peptide.category)}`}>
          {peptide.categoryLabel}
        </span>

        {onCompareToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCompareToggle(peptide);
            }}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
              isCompared
                ? 'bg-cyan-500 text-white border-cyan-400 font-bold'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
            }`}
            title="Add to side-by-side comparison"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="text-[10px]">{isCompared ? 'Compared' : 'Compare'}</span>
          </button>
        )}
      </div>

      {/* Title & Aliases */}
      <div>
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition flex items-center justify-between">
          <span>{peptide.name}</span>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition transform group-hover:translate-x-1" />
        </h3>
        
        {peptide.aliases.length > 0 && (
          <div className="text-xs text-slate-400 truncate mt-0.5" title={peptide.aliases.join(', ')}>
            {peptide.aliases[0]}
          </div>
        )}

        <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
          {peptide.summary}
        </p>
      </div>

      {/* Badges & Key Stats */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate font-mono">{peptide.halfLifeHours}h Half-Life</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              {peptide.standardDosing.typicalDose} {peptide.standardDosing.unit}
            </span>
          </div>
        </div>

        {/* Indications tags */}
        <div className="flex flex-wrap gap-1 mt-1">
          {peptide.researchIndications.slice(0, 2).map((ind, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/80 truncate max-w-[140px]">
              {ind}
            </span>
          ))}
          {peptide.researchIndications.length > 2 && (
            <span className="text-[10px] px-1.5 py-0.5 text-slate-500 font-mono">
              +{peptide.researchIndications.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
