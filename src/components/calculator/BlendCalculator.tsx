import React, { useState } from 'react';
import { SyringeType } from '../../types';
import { calculateMultiBlend, MultiBlendResult } from '../../utils/calculations';
import { SyringeVisualizer } from './SyringeVisualizer';
import { PEPTIDES_DATABASE } from '../../data/peptides';
import { 
  Layers, 
  Sparkles, 
  Plus, 
  Trash2, 
  BookmarkPlus, 
  AlertCircle, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface BlendComponentRow {
  id: string;
  peptideName: string;
  vialMassMg: number | string;
  targetDose: number | string;
  doseUnit: 'mcg' | 'mg';
}

interface BlendCalculatorProps {
  onSaveAsProtocol?: (data: {
    peptideName: string;
    vialMassMg: number;
    bacWaterMl: number;
    doseAmount: number;
    doseUnit: 'mcg' | 'mg';
    syringeType: SyringeType;
    isBlend: boolean;
    blendComponents: Array<{
      id: string;
      peptideName: string;
      vialMassMg: number;
      targetDose: number;
      doseUnit: 'mcg' | 'mg';
      deliveredDose?: number;
      deliveredUnit?: 'mcg' | 'mg';
    }>;
    costPerVial?: number;
  }) => void;
}

const PRESET_BLENDS = [
  {
    name: 'Wolverine Duo (10mg)',
    bac: 2.0,
    primaryDose: 250,
    primaryUnit: 'mcg' as const,
    components: [
      { name: 'BPC-157', mg: 5, unit: 'mcg' as const },
      { name: 'TB-500', mg: 5, unit: 'mcg' as const }
    ]
  },
  {
    name: 'Super Wolverine Tri-Blend (25mg)',
    bac: 3.0,
    primaryDose: 500,
    primaryUnit: 'mcg' as const,
    components: [
      { name: 'BPC-157', mg: 10, unit: 'mcg' as const },
      { name: 'TB-500', mg: 10, unit: 'mcg' as const },
      { name: 'KPV', mg: 5, unit: 'mcg' as const }
    ]
  },
  {
    name: 'Ultimate Glow Tri-Blend (60mg)',
    bac: 3.0,
    primaryDose: 1.5,
    primaryUnit: 'mg' as const,
    components: [
      { name: 'GHK-Cu', mg: 50, unit: 'mg' as const },
      { name: 'BPC-157', mg: 5, unit: 'mcg' as const },
      { name: 'TB-500', mg: 5, unit: 'mcg' as const }
    ]
  },
  {
    name: 'GH Axis Triple Synergist (15mg)',
    bac: 3.0,
    primaryDose: 100,
    primaryUnit: 'mcg' as const,
    components: [
      { name: 'CJC-1295 (No DAC)', mg: 5, unit: 'mcg' as const },
      { name: 'Ipamorelin', mg: 5, unit: 'mcg' as const },
      { name: 'GHRP-2', mg: 5, unit: 'mcg' as const }
    ]
  },
  {
    name: 'Metabolic Incretin + B12 (11mg)',
    bac: 2.0,
    primaryDose: 2.5,
    primaryUnit: 'mg' as const,
    components: [
      { name: 'Tirzepatide', mg: 10, unit: 'mg' as const },
      { name: 'Vitamin B12 (Cyanocobalamin)', mg: 1, unit: 'mg' as const }
    ]
  },
  {
    name: 'Neuro-Cognitive Duo (20mg)',
    bac: 2.0,
    primaryDose: 500,
    primaryUnit: 'mcg' as const,
    components: [
      { name: 'Semax', mg: 10, unit: 'mcg' as const },
      { name: 'Selank', mg: 10, unit: 'mcg' as const }
    ]
  },
  {
    name: 'Mito-Longevity Duo (20mg)',
    bac: 2.0,
    primaryDose: 2.5,
    primaryUnit: 'mg' as const,
    components: [
      { name: 'MOTS-c', mg: 10, unit: 'mg' as const },
      { name: 'SS-31', mg: 10, unit: 'mg' as const }
    ]
  },
  {
    name: 'Skin & Tissue Quad-Blend (65mg)',
    bac: 3.0,
    primaryDose: 1.5,
    primaryUnit: 'mg' as const,
    components: [
      { name: 'GHK-Cu', mg: 50, unit: 'mg' as const },
      { name: 'BPC-157', mg: 5, unit: 'mcg' as const },
      { name: 'TB-500', mg: 5, unit: 'mcg' as const },
      { name: 'KPV', mg: 5, unit: 'mcg' as const }
    ]
  }
];

export const BlendCalculator: React.FC<BlendCalculatorProps> = ({ onSaveAsProtocol }) => {
  const [blendTitle, setBlendTitle] = useState<string>('BPC-157 + TB-500 Blend');
  const [components, setComponents] = useState<BlendComponentRow[]>([
    { id: 'c-1', peptideName: 'BPC-157', vialMassMg: 5, targetDose: 250, doseUnit: 'mcg' },
    { id: 'c-2', peptideName: 'TB-500', vialMassMg: 5, targetDose: 250, doseUnit: 'mcg' }
  ]);
  const [primaryComponentId, setPrimaryComponentId] = useState<string>('c-1');
  const [bacWaterMl, setBacWaterMl] = useState<number | string>(2.0);
  const [syringeType, setSyringeType] = useState<SyringeType>('U-100');
  const [vialCost, setVialCost] = useState<number | string>('');

  const primaryComp = components.find(c => c.id === primaryComponentId) || components[0];

  const handleAddComponent = () => {
    const newId = `c-${Date.now()}`;
    setComponents([
      ...components,
      {
        id: newId,
        peptideName: `Peptide #${components.length + 1}`,
        vialMassMg: 5,
        targetDose: 250,
        doseUnit: 'mcg'
      }
    ]);
  };

  const handleRemoveComponent = (idToRemove: string) => {
    if (components.length <= 2) return;
    const next = components.filter(c => c.id !== idToRemove);
    setComponents(next);
    if (primaryComponentId === idToRemove && next.length > 0) {
      setPrimaryComponentId(next[0].id);
    }
  };

  const handleUpdateComponent = (id: string, field: keyof BlendComponentRow, value: any) => {
    setComponents(components.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const applyPreset = (preset: typeof PRESET_BLENDS[0]) => {
    const primaryMg = preset.components[0].mg || 1;
    const primaryDose = preset.primaryDose;
    const primaryUnit = preset.primaryUnit;
    const primaryDoseMg = primaryUnit === 'mcg' ? primaryDose / 1000 : primaryDose;

    const newRows: BlendComponentRow[] = preset.components.map((c, idx) => {
      if (idx === 0) {
        return {
          id: `c-preset-${idx}-${Date.now()}`,
          peptideName: c.name,
          vialMassMg: c.mg,
          targetDose: primaryDose,
          doseUnit: c.unit
        };
      }
      const compRatio = c.mg / primaryMg;
      const calcDoseMg = primaryDoseMg * compRatio;
      const targetDose = c.unit === 'mg' 
        ? Number(calcDoseMg.toFixed(2)) 
        : Math.round(calcDoseMg * 1000);

      return {
        id: `c-preset-${idx}-${Date.now()}`,
        peptideName: c.name,
        vialMassMg: c.mg,
        targetDose,
        doseUnit: c.unit
      };
    });
    setComponents(newRows);
    setPrimaryComponentId(newRows[0].id);
    setBacWaterMl(preset.bac);
    setBlendTitle(preset.name);
  };

  // Perform calculation
  const result: MultiBlendResult = calculateMultiBlend({
    components: components.map(c => ({
      id: c.id,
      peptideName: c.peptideName,
      vialMassMg: Number(c.vialMassMg) || 0,
      targetDose: Number(c.targetDose) || 0,
      doseUnit: c.doseUnit
    })),
    bacWaterMl: Number(bacWaterMl) || 0,
    primaryComponentId: primaryComp?.id || 'c-1',
    targetPrimaryDose: Number(primaryComp?.targetDose) || 0,
    primaryDoseUnit: primaryComp?.doseUnit || 'mcg',
    syringeType,
    vialCost: vialCost === '' ? undefined : Number(vialCost)
  });

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto pb-10">
      {/* Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-1.5 text-purple-400 font-semibold text-[11px] uppercase tracking-wider mb-0.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Compound Blend Reconstitution (2, 3, 4+ Peptides)</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            Multi-Peptide Stack Vial Calculator
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 max-w-xl hidden sm:block">
            For vials containing multiple peptides pre-mixed in the same lyophilized powder. Calculate exact draw volume and delivered doses for all compounds simultaneously.
          </p>
        </div>

        {onSaveAsProtocol && (
          <button
            onClick={() => onSaveAsProtocol({
              peptideName: blendTitle || 'Multi-Peptide Blend',
              vialMassMg: Number(result.totalVialMassMg) || 0,
              bacWaterMl: Number(bacWaterMl) || 2.0,
              doseAmount: Number(primaryComp.targetDose) || 250,
              doseUnit: primaryComp.doseUnit,
              syringeType,
              isBlend: true,
              blendComponents: result.components.map(c => ({
                id: c.id,
                peptideName: c.peptideName,
                vialMassMg: c.vialMassMg,
                targetDose: c.targetDose,
                doseUnit: c.doseUnit,
                deliveredDose: c.deliveredDoseMcg >= 1000 ? Number((c.deliveredDoseMcg / 1000).toFixed(2)) : Number(c.deliveredDoseMcg.toFixed(1)),
                deliveredUnit: c.deliveredDoseMcg >= 1000 ? 'mg' : 'mcg'
              })),
              costPerVial: vialCost === '' ? undefined : Number(vialCost)
            })}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/20 transition active:scale-95 shrink-0"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Save Blend to Protocol</span>
          </button>
        )}
      </div>

      {/* Preset Pills */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl flex flex-col gap-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Commercial & Compounded Blend Presets
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
          {PRESET_BLENDS.map((preset, idx) => (
            <button
              key={`preset-${idx}`}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white rounded-xl text-xs font-medium border border-purple-900/50 hover:border-purple-500/50 transition shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
          <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col gap-4 overflow-hidden">
            {/* Blend Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Blend / Stack Title
              </label>
              <input
                type="text"
                value={blendTitle}
                onChange={(e) => setBlendTitle(e.target.value)}
                placeholder="e.g. Wolverine Stack, Glow Blend, Recovery Tri-Blend"
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:border-purple-400 outline-none"
              />
            </div>

            {/* Dynamic Compound Rows */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Constituent Peptides in this Single Vial ({components.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddComponent}
                  className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-950/60 hover:bg-purple-900/80 px-2.5 py-1 rounded-lg border border-purple-800 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Peptide ({components.length + 1})</span>
                </button>
              </div>

              {components.map((comp, idx) => (
                <div 
                  key={comp.id}
                  className={`p-3 rounded-xl border flex flex-col gap-2.5 transition ${
                    comp.id === primaryComponentId 
                      ? 'bg-purple-950/30 border-purple-500/50 shadow-md' 
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-1 min-w-0">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={comp.peptideName}
                        onChange={(e) => handleUpdateComponent(comp.id, 'peptideName', e.target.value)}
                        placeholder={`Peptide #${idx + 1} Name`}
                        className="bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-bold rounded-lg px-2.5 py-1.5 focus:border-purple-400 outline-none w-full min-w-0"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPrimaryComponentId(comp.id)}
                        className={`text-[10px] px-2 py-1 rounded-md font-bold transition flex items-center gap-1 ${
                          comp.id === primaryComponentId
                            ? 'bg-purple-500 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        title="Set this peptide as the target dose driver for syringe draw calculations"
                      >
                        {comp.id === primaryComponentId && <CheckCircle2 className="w-3 h-3" />}
                        <span>{comp.id === primaryComponentId ? 'Primary Driver' : 'Set as Driver'}</span>
                      </button>

                      {components.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveComponent(comp.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition"
                          title="Remove compound"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">
                        Powder in Vial (mg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={comp.vialMassMg}
                        onChange={(e) => handleUpdateComponent(comp.id, 'vialMassMg', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg p-2 focus:border-purple-400 outline-none font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase">
                          {comp.id === primaryComponentId ? 'Target Research Dose' : 'Ratio Est.'}
                        </label>
                        <div className="flex bg-slate-950 rounded border border-slate-700 text-[9px]">
                          <button
                            type="button"
                            onClick={() => handleUpdateComponent(comp.id, 'doseUnit', 'mcg')}
                            className={`px-1.5 py-0.5 font-bold ${comp.doseUnit === 'mcg' ? 'bg-purple-500 text-white' : 'text-slate-400'}`}
                          >
                            mcg
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateComponent(comp.id, 'doseUnit', 'mg')}
                            className={`px-1.5 py-0.5 font-bold ${comp.doseUnit === 'mg' ? 'bg-purple-500 text-white' : 'text-slate-400'}`}
                          >
                            mg
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={comp.targetDose}
                        onChange={(e) => handleUpdateComponent(comp.id, 'targetDose', e.target.value)}
                        className={`w-full bg-slate-950 border text-white text-xs rounded-lg p-2 outline-none font-mono ${
                          comp.id === primaryComponentId ? 'border-purple-500' : 'border-slate-700 text-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reconstitution Volume & Syringe Type */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  BAC Water Added (mL)
                </label>
                <div className="flex gap-1.5 mb-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[1.0, 2.0, 2.5, 3.0, 5.0].map(v => (
                    <button
                      key={`bac-${v}`}
                      type="button"
                      onClick={() => setBacWaterMl(v)}
                      className={`px-2 py-0.5 text-[11px] rounded-md font-bold transition shrink-0 ${
                        bacWaterMl === v ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v} mL
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
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-xl p-2.5 focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Syringe Size
                </label>
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  {(['U-100', 'U-50', 'U-30'] as SyringeType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSyringeType(t)}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${
                        syringeType === t
                          ? 'bg-purple-950/70 border-purple-400 text-purple-200 shadow-md shadow-purple-950/50'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Vial Cost */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Vial Cost ($ USD) <span className="text-slate-500 font-normal">(Optional for cost metrics)</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 65"
                  value={vialCost}
                  onChange={(e) => setVialCost(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
          {/* Main Draw Card */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl border-purple-500/30 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Multi-Compound Draw Result
            </div>

            <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-1 shadow-inner">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Draw into Syringe</span>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-white font-mono tracking-tight my-0.5">
                {result.drawUnits}
              </div>
              <span className="text-xs sm:text-sm font-bold text-purple-400 uppercase tracking-wider">
                {syringeType} Units ({result.drawVolumeMl} mL)
              </span>
            </div>

            {/* Warnings */}
            {result.isDrawExceedingSyringe && (
              <div className="flex items-start gap-2 bg-red-950/60 border border-red-800/80 text-red-300 text-xs p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Exceeds Syringe:</strong> {result.drawUnits} units exceeds {result.syringeMaxUnits} unit limit of {syringeType}.
                </span>
              </div>
            )}

            {/* Breakdown of Every Delivered Compound in this single injection */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Simultaneously Delivered Doses</span>
                <span className="text-purple-400 text-[10px] font-mono">{result.totalDosesInVial} doses/vial</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {result.components.map(comp => (
                  <div key={comp.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{comp.peptideName}</span>
                        {comp.id === primaryComp.id && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-purple-950 text-purple-300 border border-purple-800 rounded">
                            Driver
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {comp.vialMassMg}mg in vial • {comp.concentrationMgMl} mg/mL
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-purple-300 font-mono">
                        {comp.deliveredDoseFormatted}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        per injection
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {result.costPerDose !== undefined && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400">Research Cost per Dose:</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">${result.costPerDose.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Syringe Visualizer */}
      <div className="mt-1">
        <SyringeVisualizer
          syringeType={syringeType}
          drawUnits={result.drawUnits}
          concentrationMcgPerUnit={primaryComp ? ((Number(primaryComp.vialMassMg) || 0) * 10) / (Number(bacWaterMl) || 1) : 0}
          peptideName={blendTitle}
          onUnitsChange={(units) => {
            const primaryConc = ((Number(primaryComp?.vialMassMg) || 0) * 10) / (Number(bacWaterMl) || 1);
            if (primaryConc > 0 && primaryComp) {
              const newDose = units * primaryConc;
              handleUpdateComponent(
                primaryComp.id, 
                'targetDose', 
                primaryComp.doseUnit === 'mg' ? Number((newDose / 1000).toFixed(3)) : Math.round(newDose)
              );
            }
          }}
        />
      </div>
    </div>
  );
};
