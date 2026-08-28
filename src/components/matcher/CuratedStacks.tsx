import React from 'react';
import { CURATED_STACKS } from '../../data/stacks';
import { CuratedStack } from '../../types';
import { Layers, Sparkles, PlusCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface CuratedStacksProps {
  onAdoptStack?: (stack: CuratedStack, asSingleBlend?: boolean) => void;
  onSelectPeptideByName?: (name: string) => void;
}

export const CuratedStacks: React.FC<CuratedStacksProps> = ({
  onAdoptStack,
  onSelectPeptideByName,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-[0.85rem] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Curated Research Stacks & Combinations</span>
        </h2>
        <p className="text-xs text-slate-400">
          Scientifically paired multi-peptide protocols designed around biological synergy and non-competing receptor mechanisms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CURATED_STACKS.map(stack => (
          <div
            key={stack.id}
            className="glass-panel p-6 rounded-3xl flex flex-col justify-between gap-5 border-slate-800 hover:border-cyan-500/30 transition shadow-xl"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {stack.experienceLevel} Level
                </span>
                <div className="flex gap-1">
                  {stack.goals.slice(0, 2).map((g, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {stack.name}
              </h3>
              <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                {stack.tagline}
              </p>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {stack.description}
              </p>

              {/* Peptides in stack */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Stack Components & Synergies
                </span>
                {stack.peptides.map((pep, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span>{pep.peptideName}</span>
                      </span>
                      <span className="text-cyan-300 font-mono text-[11px] font-semibold">
                        {pep.typicalDose}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {pep.frequency} • {pep.timing}
                    </div>
                    <div className="text-[11px] text-slate-400 italic mt-0.5">
                      "{pep.synergyReason}"
                    </div>
                  </div>
                ))}
              </div>

              {stack.warnings && stack.warnings.length > 0 && (
                <div className="mt-3 bg-amber-950/20 p-2.5 rounded-xl border border-amber-900/30 flex items-start gap-2 text-[11px] text-amber-200/80">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{stack.warnings[0]}</span>
                </div>
              )}
            </div>

            {onAdoptStack && (
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => onAdoptStack(stack, true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40"
                >
                  <Layers className="w-4 h-4" />
                  <span>🧪 Start as One Pre-Mixed Vial</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAdoptStack(stack, false)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  <span>📋 Start as Separate Vials</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
