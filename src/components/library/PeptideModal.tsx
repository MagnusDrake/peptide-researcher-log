import React from 'react';
import { Peptide } from '../../types';
import { 
  X, 
  Calculator, 
  PlusCircle, 
  Clock, 
  ShieldAlert, 
  BookOpen, 
  Layers, 
  ThermometerSnowflake, 
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Dna
} from 'lucide-react';

interface PeptideModalProps {
  peptide: Peptide | null;
  onClose: () => void;
  onOpenInCalculator: (peptide: Peptide) => void;
  onAddToProtocol: (peptide: Peptide) => void;
}

export const PeptideModal: React.FC<PeptideModalProps> = ({
  peptide,
  onClose,
  onOpenInCalculator,
  onAddToProtocol,
}) => {
  if (!peptide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {peptide.categoryLabel}
              </span>
              {peptide.subCategory && (
                <span className="text-xs text-slate-400 font-medium">
                  • {peptide.subCategory}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
              {peptide.name}
            </h2>
            {peptide.aliases.length > 0 && (
              <p className="text-xs text-slate-400">
                Also known as: <span className="text-slate-300 font-medium">{peptide.aliases.join(', ')}</span>
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-slate-200 text-sm">
          {/* Summary & Molecular Overview */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Overview & Mechanism of Action</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {peptide.summary}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
              <strong className="text-slate-300">Biochemical Mechanism:</strong> {peptide.mechanism}
            </p>
            
            {(peptide.molecularFormula || peptide.sequence) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 mt-1">
                {peptide.molecularFormula && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-sans">Formula</span>
                    <span className="text-cyan-300">{peptide.molecularFormula}</span>
                  </div>
                )}
                {peptide.sequence && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-sans">Sequence</span>
                    <span className="text-slate-300 truncate block" title={peptide.sequence}>{peptide.sequence}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dosing, Kinetics & Administration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Dosing */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Research Dosing Guidelines</span>
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Typical Dosage Range</span>
                  <span className="font-bold text-white font-mono">
                    {peptide.standardDosing.minDose} - {peptide.standardDosing.maxDose} {peptide.standardDosing.unit}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Standard Single Dose</span>
                  <span className="font-bold text-cyan-400 font-mono">
                    {peptide.standardDosing.typicalDose} {peptide.standardDosing.unit}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Administration Frequency</span>
                  <span className="font-medium text-slate-200 text-right max-w-[180px]">
                    {peptide.standardDosing.frequency}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Optimal Timing</span>
                  <span className="font-medium text-slate-200 text-right max-w-[180px]">
                    {peptide.standardDosing.timing}
                  </span>
                </div>
                {peptide.standardDosing.cycleLengthWeeks && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Typical Cycle Length</span>
                    <span className="font-medium text-emerald-400">
                      {peptide.standardDosing.cycleLengthWeeks}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Pharmacokinetics & Reconstitution */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ThermometerSnowflake className="w-4 h-4" />
                <span>Kinetics & Storage</span>
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Biological Half-Life</span>
                  <span className="font-bold text-cyan-300 font-mono">
                    {peptide.halfLifeHours} hours
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 -mt-1 pb-1 border-b border-slate-800">
                  {peptide.halfLifeLabel}
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Common Vial Sizes</span>
                  <span className="font-medium text-slate-200 font-mono">
                    {peptide.commonVialSizesMg.map(s => `${s}mg`).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Typical BAC Water Volume</span>
                  <span className="font-medium text-slate-200 font-mono">
                    {peptide.typicalBacWaterMl.map(v => `${v}mL`).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Reconstituted Shelf Life</span>
                  <span className="font-medium text-amber-300">
                    {peptide.storageGuidance.shelfLifeReconstitutedDays} days @ 2-8°C
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Studied Indications */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Primary Research Indications & Objectives
            </h3>
            <div className="flex flex-wrap gap-2">
              {peptide.researchIndications.map((ind, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-slate-800/80 text-cyan-300 border border-slate-700/80 text-xs font-medium"
                >
                  ✓ {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Reconstitution Instructions & Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tips */}
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Handling & Mixing Notes</span>
              </h4>
              <ul className="text-xs text-slate-400 flex flex-col gap-1.5 list-disc list-inside">
                {peptide.reconstitutionTips.map((tip, i) => (
                  <li key={i} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>

            {/* Cautions */}
            <div className="bg-amber-950/20 p-4 rounded-2xl border border-amber-900/40 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Side Effect Observations & Cautions</span>
              </h4>
              <ul className="text-xs text-amber-200/80 flex flex-col gap-1.5 list-disc list-inside">
                {peptide.sideEffectWarnings.map((warn, i) => (
                  <li key={i} className="leading-relaxed">{warn}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Literature Citations */}
          {peptide.literatureReferences.length > 0 && (
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Published Research Literature & Citations</span>
              </h4>
              <div className="flex flex-col gap-2 mt-1">
                {peptide.literatureReferences.map((ref, i) => (
                  <div key={i} className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold block text-slate-200">{ref.title}</span>
                      <span className="text-[11px] text-slate-400">
                        {ref.journal} ({ref.year}) {ref.pmid ? `• PMID: ${ref.pmid}` : ''}
                      </span>
                    </div>
                    {ref.pmid && (
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white transition shrink-0"
                        title="View PubMed Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            For laboratory & educational research logging.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onOpenInCalculator(peptide);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold border border-slate-700 transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Reconstitution</span>
            </button>

            <button
              onClick={() => {
                onAddToProtocol(peptide);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Protocol</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
