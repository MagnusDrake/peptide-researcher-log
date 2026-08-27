import React, { useState, useEffect } from 'react';
import { SyringeType, Peptide } from '../../types';
import { calculateReconstitution, ReconstitutionResult } from '../../utils/calculations';
import { PEPTIDES_DATABASE } from '../../data/peptides';
import { SyringeVisualizer } from './SyringeVisualizer';
import { 
  Calculator, 
  Sparkles, 
  HelpCircle, 
  DollarSign, 
  BookmarkPlus, 
  AlertCircle, 
  Info,
  ChevronDown,
  ChevronUp,
  FlaskConical
} from 'lucide-react';

interface ReconstitutionCalcProps {
  initialPeptideId?: string;
  onSaveAsProtocol?: (data: {
    peptideId: string;
    peptideName: string;
    vialMassMg: number;
    bacWaterMl: number;
    doseAmount: number;
    doseUnit: 'mcg' | 'mg';
    syringeType: SyringeType;
    costPerVial?: number;
  }) => void;
}

export const ReconstitutionCalc: React.FC<ReconstitutionCalcProps> = ({
  initialPeptideId = 'bpc-157',
  onSaveAsProtocol,
}) => {
  const [selectedPeptideId, setSelectedPeptideId] = useState<string>(initialPeptideId);
  const [customPeptideName, setCustomPeptideName] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('');
  const [vialMassMg, setVialMassMg] = useState<number | string>(5);
  const [bacWaterMl, setBacWaterMl] = useState<number | string>(2.0);
  const [targetDose, setTargetDose] = useState<number | string>(500);
  const [doseUnit, setDoseUnit] = useState<'mcg' | 'mg'>('mcg');
  const [syringeType, setSyringeType] = useState<SyringeType>('U-100');
  const [vialCost, setVialCost] = useState<number | string>('');
  const [isTipsOpen, setIsTipsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Active peptide from database
  const activePeptide = PEPTIDES_DATABASE.find(p => p.id === selectedPeptideId);

  // When peptide changes from dropdown, pre-populate common sizes if available
  useEffect(() => {
    if (activePeptide) {
      if (activePeptide.commonVialSizesMg && activePeptide.commonVialSizesMg.length > 0) {
        setVialMassMg(activePeptide.commonVialSizesMg[0]);
      }
      if (activePeptide.typicalBacWaterMl && activePeptide.typicalBacWaterMl.length > 0) {
        setBacWaterMl(activePeptide.typicalBacWaterMl[0]);
      }
      if (activePeptide.standardDosing) {
        setTargetDose(activePeptide.standardDosing.typicalDose);
        setDoseUnit(activePeptide.standardDosing.unit);
      }
    }
  }, [selectedPeptideId]);

  // Real-time calculation result
  const result: ReconstitutionResult = calculateReconstitution({
    vialMassMg: Number(vialMassMg) || 0,
    bacWaterMl: Number(bacWaterMl) || 0,
    targetDose: Number(targetDose) || 0,
    doseUnit,
    syringeType,
    vialCost: vialCost === '' ? undefined : Number(vialCost)
  });

  const currentPeptideName = activePeptide ? activePeptide.name : (customPeptideName || 'Custom Peptide');

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto pb-10">
      {/* Top Banner (Compact on mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-slate-900/60 p-4 sm:p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px] uppercase tracking-wider mb-0.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Reconstitution Engine</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            Peptide Reconstitution & Syringe
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 max-w-xl hidden sm:block">
            Calculate precise liquid concentrations, syringe draw tick marks, doses per vial, and cost metrics for research protocols.
          </p>
        </div>

        {onSaveAsProtocol && (
          <button
            onClick={() => onSaveAsProtocol({
              peptideId: selectedPeptideId,
              peptideName: currentPeptideName,
              vialMassMg: Number(vialMassMg) || 5,
              bacWaterMl: Number(bacWaterMl) || 2.0,
              doseAmount: Number(targetDose) || 500,
              doseUnit,
              syringeType,
              costPerVial: vialCost === '' ? undefined : Number(vialCost)
            })}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 btn-glow-cyan hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition active:scale-95 shrink-0"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Save to Protocol</span>
          </button>
        )}
      </div>

      {/* Mobile Sticky Quick-Result Pill */}
      <div className="lg:hidden bg-slate-900/95 border border-cyan-500/40 p-3 rounded-2xl shadow-xl flex items-center justify-between gap-2 backdrop-blur-md sticky top-16 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
            💉
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Draw into Syringe</div>
            <div className="text-base font-black text-cyan-300 font-mono leading-none">
              {result.drawUnits} <span className="text-xs font-semibold text-slate-300">{syringeType} units</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-medium">{result.concentrationMgMl} mg/mL</div>
          <div className="text-xs font-bold text-emerald-400 font-mono">{result.totalDosesInVial} doses/vial</div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* INPUTS COLUMN (7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
          <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col gap-4 overflow-hidden">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Vial & Solution Parameters</span>
            </h2>

            {/* 1. Peptide Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                1. Select Research Peptide
              </label>
              <select
                value={selectedPeptideId}
                onChange={(e) => setSelectedPeptideId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl p-2.5 sm:p-3 focus:outline-none focus:border-cyan-400 transition"
              >
                <optgroup label="Popular Research Peptides">
                  {PEPTIDES_DATABASE.map(pep => (
                    <option key={pep.id} value={pep.id}>
                      {pep.name} ({pep.categoryLabel})
                    </option>
                  ))}
                </optgroup>
                <option value="custom">✨ Custom / Other Peptide</option>
              </select>

              {selectedPeptideId === 'custom' && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Enter custom peptide name (e.g. Proprietary Blend-A)"
                    value={customPeptideName}
                    onChange={(e) => setCustomPeptideName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}
            </div>

            {/* Optional Brand/Supplier */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Brand / Supplier / Compounding Source <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Peptide Sciences, BioTech Lab, Custom Compounding"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-slate-900/70 border border-slate-800 text-white text-xs sm:text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />
            </div>

            {/* 2. Vial Mass (mg) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  2. Vial Powder Quantity (mg)
                </label>
                <span className="text-xs text-cyan-400 font-mono font-bold">{vialMassMg} mg</span>
              </div>
              
              {/* Quick chips (Horizontal scroll on phone) */}
              <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
                {[2, 5, 10, 15, 20, 50, 100].map(val => (
                  <button
                    key={`mass-${val}`}
                    type="button"
                    onClick={() => setVialMassMg(val)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition shrink-0 ${
                      vialMassMg === val
                        ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {val} mg
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={vialMassMg}
                onChange={(e) => setVialMassMg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* 3. Bacteriostatic Water Added (mL) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  3. Bacteriostatic (BAC) Water Added (mL)
                </label>
                <span className="text-xs text-cyan-400 font-mono font-bold">{bacWaterMl || 0} mL</span>
              </div>

              {/* Quick chips (Horizontal scroll on phone) */}
              <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
                {[1.0, 1.5, 2.0, 2.5, 3.0, 5.0, 10.0].map(val => (
                  <button
                    key={`bac-${val}`}
                    type="button"
                    onClick={() => setBacWaterMl(val)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition shrink-0 ${
                      bacWaterMl === val
                        ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {val} mL
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={bacWaterMl}
                onChange={(e) => setBacWaterMl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* 4. Target Research Dose */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  4. Desired Research Dose
                </label>
                <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      if (doseUnit === 'mg') {
                        setDoseUnit('mcg');
                        if (targetDose !== '') setTargetDose(Number(targetDose) * 1000);
                      }
                    }}
                    className={`px-2.5 py-0.5 text-xs rounded-md font-bold transition ${
                      doseUnit === 'mcg' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    mcg
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (doseUnit === 'mcg') {
                        setDoseUnit('mg');
                        if (targetDose !== '') setTargetDose(Number(targetDose) / 1000);
                      }
                    }}
                    className={`px-2.5 py-0.5 text-xs rounded-md font-bold transition ${
                      doseUnit === 'mg' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    mg
                  </button>
                </div>
              </div>

              {/* Quick dose suggestion chips */}
              <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
                {doseUnit === 'mcg' ? (
                  [100, 200, 250, 300, 500, 750, 1000].map(val => (
                    <button
                      key={`dose-${val}`}
                      type="button"
                      onClick={() => setTargetDose(val)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition shrink-0 ${
                        targetDose === val
                          ? 'bg-cyan-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {val} mcg
                    </button>
                  ))
                ) : (
                  [0.25, 0.5, 1.0, 2.0, 2.5, 5.0, 7.5, 10.0, 15.0].map(val => (
                    <button
                      key={`dose-mg-${val}`}
                      type="button"
                      onClick={() => setTargetDose(val)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition shrink-0 ${
                        targetDose === val
                          ? 'bg-cyan-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {val} mg
                    </button>
                  ))
                )}
              </div>

              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={targetDose}
                onChange={(e) => setTargetDose(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* 5. Syringe Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                5. Syringe Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['U-100', 'U-50', 'U-30'] as SyringeType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSyringeType(type)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition ${
                      syringeType === type
                        ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold text-xs sm:text-sm">{type}</span>
                    <span className="text-[10px] text-slate-400">
                      {type === 'U-100' ? '1.0 mL' : type === 'U-50' ? '0.5 mL' : '0.3 mL'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Optional Vial Cost */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Vial Cost ($ USD) <span className="text-slate-500 font-normal">(Optional for cost-per-dose)</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 45"
                  value={vialCost}
                  onChange={(e) => setVialCost(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS & SUMMARY COLUMN (5 Cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
          {/* Primary Result Hero Card */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl border-cyan-500/30 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Calculation Result
            </div>

            {/* Big Draw Units Display */}
            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-1 shadow-inner">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Draw into Syringe</span>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-white font-mono tracking-tight my-0.5">
                {result.drawUnits}
              </div>
              <span className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider">
                {syringeType} Units ({result.drawVolumeMl} mL)
              </span>
            </div>

            {/* Warning if exceeds syringe */}
            {result.isDrawExceedingSyringe && (
              <div className="flex items-start gap-2 bg-red-950/60 border border-red-800/80 text-red-300 text-xs p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Exceeds Syringe Capacity:</strong> {result.drawUnits} units exceeds the {result.syringeMaxUnits} unit limit of a {syringeType} syringe. Consider switching to a U-100 syringe or adding less BAC water.
                </span>
              </div>
            )}

            {/* Precision warning */}
            {result.precisionWarning && !result.isDrawExceedingSyringe && (
              <div className="flex items-start gap-2 bg-amber-950/50 border border-amber-800/60 text-amber-300 text-xs p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{result.precisionWarning}</span>
              </div>
            )}

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                <div className="text-[9px] text-slate-400 uppercase font-medium">Concentration</div>
                <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
                  {result.concentrationMgMl} <span className="text-[10px] text-slate-400 font-normal">mg/mL</span>
                </div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  {result.concentrationMcgPerUnit} mcg / u
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                <div className="text-[9px] text-slate-400 uppercase font-medium">Doses per Vial</div>
                <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono mt-0.5">
                  {result.totalDosesInVial} <span className="text-[10px] text-slate-400 font-normal">doses</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Total {result.targetDoseMg}mg/dose
                </div>
              </div>

              {result.costPerDose !== undefined && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 col-span-2">
                  <div className="text-[9px] text-slate-400 uppercase font-medium">Research Cost per Dose</div>
                  <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                    ${result.costPerDose.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ injection</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Peptide Profile Collapsible Snapshot (if selected from DB) */}
          {activePeptide && (
            <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2.5">
              <button 
                type="button" 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Compound Profile</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
                    {activePeptide.categoryLabel}
                  </span>
                  {isProfileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              <div className={`flex flex-col gap-2 text-xs text-slate-300 ${isProfileOpen ? 'block' : 'hidden sm:block'}`}>
                <p className="line-clamp-2 text-slate-300 leading-relaxed text-[11px]">
                  {activePeptide.summary}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 uppercase text-[9px] block">Half-Life</span>
                    <span className="font-bold text-cyan-400">{activePeptide.halfLifeLabel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase text-[9px] block">Frequency</span>
                    <span className="font-medium text-slate-300">{activePeptide.standardDosing.frequency}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reconstitution Best Practices Collapsible */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsTipsOpen(!isTipsOpen)}
              className="flex items-center justify-between text-left text-xs font-bold text-slate-300 uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Reconstitution Best Practices</span>
              </div>
              {isTipsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isTipsOpen && (
              <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Aim gently:</strong> Run BAC water down the inside glass wall of the vial, never spray directly onto lyophilized powder.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Never shake:</strong> Swirl gently until dissolved. Shaking can shear and denature delicate peptide bonds.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Refrigerate:</strong> Keep reconstituted solution at 2-8°C (36-46°F) and protect from direct UV light.</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* FULL-WIDTH SYRINGE VISUALIZER SECTION */}
      <div className="mt-1">
        <SyringeVisualizer
          syringeType={syringeType}
          drawUnits={result.drawUnits}
          concentrationMcgPerUnit={result.concentrationMcgPerUnit}
          peptideName={currentPeptideName}
          onUnitsChange={(units) => {
            if (result.concentrationMcgPerUnit > 0) {
              const newDose = units * result.concentrationMcgPerUnit;
              if (doseUnit === 'mg') {
                setTargetDose(Number((newDose / 1000).toFixed(3)));
              } else {
                setTargetDose(Math.round(newDose));
              }
            }
          }}
        />
      </div>
    </div>
  );
};
