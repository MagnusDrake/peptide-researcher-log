import React from 'react';
import { Peptide } from '../../types';
import { X, Scale, Clock, Sparkles, CheckCircle2, ShieldAlert, ThermometerSnowflake } from 'lucide-react';

interface PeptideCompareProps {
  peptides: Peptide[];
  onRemove: (peptideId: string) => void;
  onClear: () => void;
  onSelectPeptide: (peptide: Peptide) => void;
}

export const PeptideCompare: React.FC<PeptideCompareProps> = ({
  peptides,
  onRemove,
  onClear,
  onSelectPeptide,
}) => {
  if (peptides.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col gap-5 border-cyan-500/30 shadow-2xl mb-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Side-by-Side Peptide Comparison</h2>
            <p className="text-xs text-slate-400">Comparing {peptides.length} research compounds across key pharmacological dimensions</p>
          </div>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-400 underline transition"
        >
          Clear Comparison
        </button>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-3.5 bg-slate-950 text-slate-400 uppercase font-semibold w-48 border border-slate-800">
                Metric / Property
              </th>
              {peptides.map(pep => (
                <th key={pep.id} className="p-3.5 bg-slate-900/90 text-white font-bold text-sm border border-slate-800 min-w-[240px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="block text-base font-extrabold text-cyan-300">{pep.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{pep.categoryLabel}</span>
                    </div>
                    <button
                      onClick={() => onRemove(pep.id)}
                      className="p-1 text-slate-500 hover:text-red-400 rounded-full hover:bg-slate-800 transition"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800 text-slate-300">
            {/* Primary Category */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-3.5 font-semibold text-slate-400 bg-slate-950/60 border border-slate-800">
                Category
              </td>
              {peptides.map(pep => (
                <td key={pep.id} className="p-3.5 border border-slate-800 font-medium">
                  {pep.categoryLabel} ({pep.subCategory || 'General'})
                </td>
              ))}
            </tr>

            {/* Biological Half-Life */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-3.5 font-semibold text-slate-400 bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Half-Life</span>
                </div>
              </td>
              {peptides.map(pep => (
                <td key={pep.id} className="p-3.5 border border-slate-800">
                  <div className="font-bold text-cyan-300 font-mono text-sm">{pep.halfLifeHours} Hours</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{pep.halfLifeLabel}</div>
                </td>
              ))}
            </tr>

            {/* Research Dosage & Frequency */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-3.5 font-semibold text-slate-400 bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Typical Research Dose</span>
                </div>
              </td>
              {peptides.map(pep => (
                <td key={pep.id} className="p-3.5 border border-slate-800">
                  <div className="font-bold text-white font-mono text-sm">
                    {pep.standardDosing.typicalDose} {pep.standardDosing.unit}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Range: {pep.standardDosing.minDose} - {pep.standardDosing.maxDose} {pep.standardDosing.unit}</div>
                  <div className="text-slate-300 text-[11px] font-medium mt-1">Frequency: {pep.standardDosing.frequency}</div>
                </td>
              ))}
            </tr>

            {/* Administration Timing */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-3.5 font-semibold text-slate-400 bg-slate-950/60 border border-slate-800">
                Optimal Timing
              </td>
              {peptides.map(pep => (
                <td key={pep.id} className="p-3.5 border border-slate-800 text-slate-300">
                  {pep.standardDosing.timing}
                </td>
              ))}
            </tr>

            {/* Reconstitution & Storage */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-3.5 font-semibold text-slate-400 bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-400" />
                  <span>Vial Sizes & BAC Water</span>
                </div>
              </td>
              {peptides.map(pep => (
                <td key={pep.id} className="p-3.5 border border-slate-800">
                  <div className="text-slate-300">Vial Sizes: <span className="font-mono font-bold text-white">{pep.commonVialSizesMg.map(s => `${s}mg`).join(', ')}</span></div>
                  <div className="text-slate-400 mt-0.5">Typical BAC: <span className="font-mono">{pep.typicalBacWaterMl.map(v => `${v}mL`).join(', ')}</span></div>
                  <div className="text-amber-300 text-[11px] mt-1">Shelf-life: ~{pep.storageGuidance.shelfLifeReconstitutedDays} days @ 2-8°C</div>
                </td>
              ))}
            </tr>

            {/* Primary Indications */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-3.5 font-semibold text-slate-400 bg-slate-950/60 border border-slate-800">
                Research Indications
              </td>
              {peptides.map(pep => (
                <td key={pep.id} className="p-3.5 border border-slate-800">
                  <ul className="flex flex-col gap-1 list-disc list-inside text-slate-300">
                    {pep.researchIndications.map((ind, i) => (
                      <li key={i} className="leading-snug">{ind}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Mechanism Summary */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-3.5 font-semibold text-slate-400 bg-slate-950/60 border border-slate-800">
                Mechanism of Action
              </td>
              {peptides.map(pep => (
                <td key={pep.id} className="p-3.5 border border-slate-800 text-slate-300 leading-relaxed">
                  {pep.mechanism}
                </td>
              ))}
            </tr>

            {/* Cautions */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-3.5 font-semibold text-slate-400 bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Cautions / Side Effects</span>
                </div>
              </td>
              {peptides.map(pep => (
                <td key={pep.id} className="p-3.5 border border-slate-800 text-amber-200/80 text-[11px]">
                  {pep.sideEffectWarnings.join(' • ')}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
