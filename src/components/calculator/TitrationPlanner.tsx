import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Info, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sliders, 
  Sparkles, 
  FlaskConical,
  Scale
} from 'lucide-react';
import { SyringeType } from '../../types';

export interface TitrationStep {
  weekRange: string;
  doseAmount: number;
  doseUnit: 'mcg' | 'mg';
  description: string;
}

export interface TitrationPreset {
  id: string;
  name: string;
  category: string;
  vialMassMg: number;
  bacWaterMl: number;
  syringeType: SyringeType;
  frequency: string;
  steps: TitrationStep[];
}

const PRESETS: TitrationPreset[] = [
  {
    id: 'tirzepatide-std',
    name: 'Tirzepatide Standard Escalation (SURMOUNT)',
    category: 'GLP-1 / GIP Dual Agonist',
    vialMassMg: 10,
    bacWaterMl: 2.0,
    syringeType: 'U-100',
    frequency: 'Once Weekly (Every 7 Days)',
    steps: [
      { weekRange: 'Weeks 1 - 4', doseAmount: 2.5, doseUnit: 'mg', description: 'Initiation & metabolic acclimation (reduces GI sensitivity)' },
      { weekRange: 'Weeks 5 - 8', doseAmount: 5.0, doseUnit: 'mg', description: 'Primary therapeutic step; evaluate glycemic and appetite response' },
      { weekRange: 'Weeks 9 - 12', doseAmount: 7.5, doseUnit: 'mg', description: 'Secondary escalation if weight loss plateaus at 5mg' },
      { weekRange: 'Weeks 13 - 16', doseAmount: 10.0, doseUnit: 'mg', description: 'High therapeutic target for metabolic optimization' },
      { weekRange: 'Weeks 17 - 20', doseAmount: 12.5, doseUnit: 'mg', description: 'Advanced titration step' },
      { weekRange: 'Weeks 21+', doseAmount: 15.0, doseUnit: 'mg', description: 'Maximum studied clinical maintenance dose' }
    ]
  },
  {
    id: 'semaglutide-std',
    name: 'Semaglutide Standard Escalation (STEP-1)',
    category: 'GLP-1 Selective Agonist',
    vialMassMg: 5,
    bacWaterMl: 2.0,
    syringeType: 'U-100',
    frequency: 'Once Weekly (Every 7 Days)',
    steps: [
      { weekRange: 'Weeks 1 - 4', doseAmount: 0.25, doseUnit: 'mg', description: 'Starting dose for GI tract adaptation (sub-therapeutic)' },
      { weekRange: 'Weeks 5 - 8', doseAmount: 0.50, doseUnit: 'mg', description: 'First step escalation; initial appetite suppression observed' },
      { weekRange: 'Weeks 9 - 12', doseAmount: 1.00, doseUnit: 'mg', description: 'Target therapeutic dose for glycemic & weight control' },
      { weekRange: 'Weeks 13 - 16', doseAmount: 1.70, doseUnit: 'mg', description: 'Higher maintenance step' },
      { weekRange: 'Weeks 17+', doseAmount: 2.40, doseUnit: 'mg', description: 'Full clinical maintenance target dose' }
    ]
  },
  {
    id: 'retatrutide-trial',
    name: 'Retatrutide Research Protocol (Phase 2)',
    category: 'Triple GGG Agonist',
    vialMassMg: 10,
    bacWaterMl: 2.0,
    syringeType: 'U-100',
    frequency: 'Once Weekly (Every 7 Days)',
    steps: [
      { weekRange: 'Weeks 1 - 4', doseAmount: 2.0, doseUnit: 'mg', description: 'Initial tolerance assessment & heart rate monitoring' },
      { weekRange: 'Weeks 5 - 8', doseAmount: 4.0, doseUnit: 'mg', description: 'Moderate metabolic and thermogenic acceleration' },
      { weekRange: 'Weeks 9 - 12', doseAmount: 8.0, doseUnit: 'mg', description: 'High-efficacy fat oxidation & hepatic clearance dose' },
      { weekRange: 'Weeks 13+', doseAmount: 12.0, doseUnit: 'mg', description: 'Maximum studied trial dose' }
    ]
  },
  {
    id: 'cagrilintide-std',
    name: 'Cagrilintide Amylin Dual Titration',
    category: 'Amylin Analogue / Satiety Agonist',
    vialMassMg: 5,
    bacWaterMl: 2.0,
    syringeType: 'U-100',
    frequency: 'Once Weekly (Every 7 Days)',
    steps: [
      { weekRange: 'Weeks 1 - 4', doseAmount: 0.16, doseUnit: 'mg', description: 'Low starting dose to establish gastric emptying adaptation' },
      { weekRange: 'Weeks 5 - 8', doseAmount: 0.30, doseUnit: 'mg', description: 'Moderate satiety enhancement' },
      { weekRange: 'Weeks 9 - 12', doseAmount: 0.60, doseUnit: 'mg', description: 'Target maintenance step for dual-agonist synergy' },
      { weekRange: 'Weeks 13 - 16', doseAmount: 1.20, doseUnit: 'mg', description: 'High therapeutic dose' },
      { weekRange: 'Weeks 17+', doseAmount: 2.40, doseUnit: 'mg', description: 'Maximum studied maintenance dose' }
    ]
  },
  {
    id: 'ghk-cu-ramp',
    name: 'GHK-Cu Skin & Tissue Ramp (Anti-Sting)',
    category: 'Copper Peptide / Tissue Remodeling',
    vialMassMg: 50,
    bacWaterMl: 2.5,
    syringeType: 'U-100',
    frequency: 'Daily or 5 Days/Week',
    steps: [
      { weekRange: 'Week 1', doseAmount: 1.0, doseUnit: 'mg', description: 'Low dose to test localized skin sensitivity and prevent stinging' },
      { weekRange: 'Week 2', doseAmount: 1.5, doseUnit: 'mg', description: 'Gradual increase in collagen matrix synthesis' },
      { weekRange: 'Weeks 3 - 4', doseAmount: 2.0, doseUnit: 'mg', description: 'Standard therapeutic anti-aging and tissue remodeling dose' },
      { weekRange: 'Weeks 5 - 6', doseAmount: 3.0, doseUnit: 'mg', description: 'Advanced recovery & fibroblast activation dose' }
    ]
  },
  {
    id: 'cjc-ipa-ramp',
    name: 'CJC-1295 / Ipamorelin Secretagogue Ramp',
    category: 'GH Secretagogue / Pituitary',
    vialMassMg: 5,
    bacWaterMl: 2.0,
    syringeType: 'U-100',
    frequency: 'Daily (5 Days On / 2 Days Off)',
    steps: [
      { weekRange: 'Weeks 1 - 2', doseAmount: 100, doseUnit: 'mcg', description: 'Initial pituitary somatotroph stimulation assessment' },
      { weekRange: 'Weeks 3 - 4', doseAmount: 150, doseUnit: 'mcg', description: 'Moderate IGF-1 elevation and deep sleep support' },
      { weekRange: 'Weeks 5 - 8', doseAmount: 200, doseUnit: 'mcg', description: 'Optimal pulsed GH peak without receptor desensitization' },
      { weekRange: 'Weeks 9 - 12', doseAmount: 250, doseUnit: 'mcg', description: 'Maximum recommended cycle dose' }
    ]
  }
];

export const TitrationPlanner: React.FC = () => {
  const [plannerMode, setPlannerMode] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tirzepatide-std');

  // Reconstitution Configuration
  const [vialMassMg, setVialMassMg] = useState<number | string>(10);
  const [bacWaterMl, setBacWaterMl] = useState<number | string>(2.0);
  const [syringeType, setSyringeType] = useState<SyringeType>('U-100');

  // Custom Titration Creator State
  const [customName, setCustomName] = useState<string>('My Custom Peptide Titration');
  const [customFrequency, setCustomFrequency] = useState<string>('Once Weekly');
  const [customUnit, setCustomUnit] = useState<'mcg' | 'mg'>('mg');
  const [customSteps, setCustomSteps] = useState<TitrationStep[]>([
    { weekRange: 'Weeks 1 - 4', doseAmount: 1.0, doseUnit: 'mg', description: 'Starting introductory dose' },
    { weekRange: 'Weeks 5 - 8', doseAmount: 2.0, doseUnit: 'mg', description: 'Intermediate step-up' },
    { weekRange: 'Weeks 9 - 12', doseAmount: 3.0, doseUnit: 'mg', description: 'Target therapeutic maintenance dose' },
  ]);

  const activePreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  // Concentration in mg/mL
  const concentrationMgMl = (Number(vialMassMg) || 0) / (Number(bacWaterMl) || 1);
  
  // Total mcg in vial and mcg per unit
  const totalMcgInVial = (Number(vialMassMg) || 0) * 1000;
  const mcgPerMl = totalMcgInVial / (Number(bacWaterMl) || 1);
  const mcgPerUnitU100 = mcgPerMl / 100;

  const calculateDraw = (amount: number, unit: 'mcg' | 'mg') => {
    const targetMcg = unit === 'mg' ? amount * 1000 : amount;
    if (mcgPerUnitU100 <= 0) return { units: 0, ml: '0.00' };

    const units = targetMcg / mcgPerUnitU100;
    const roundedUnits = Number(units.toFixed(1));
    const volumeMl = (targetMcg / (mcgPerMl || 1)).toFixed(2);
    return { units: roundedUnits, ml: volumeMl };
  };

  const handleAddCustomStep = () => {
    const nextStepNum = customSteps.length + 1;
    const lastStep = customSteps[customSteps.length - 1];
    const newDose = lastStep ? Number((lastStep.doseAmount * 1.5).toFixed(2)) : 1.0;

    setCustomSteps(prev => [
      ...prev,
      {
        weekRange: `Weeks ${nextStepNum * 4 - 3} - ${nextStepNum * 4}`,
        doseAmount: newDose,
        doseUnit: customUnit,
        description: `Stage ${nextStepNum} dose escalation`
      }
    ]);
  };

  const handleRemoveCustomStep = (index: number) => {
    if (customSteps.length <= 1) return;
    setCustomSteps(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateCustomStep = (index: number, field: keyof TitrationStep, value: any) => {
    setCustomSteps(prev => prev.map((step, idx) => {
      if (idx !== index) return step;
      return { ...step, [field]: value };
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Dosing Protocol & Titration Schedules</span>
          </div>
          <h2 className="text-[0.85rem] font-bold text-white uppercase tracking-widest">
            Dose Ramp-Up & Titration Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Plan multi-week step-up cycles to allow your receptors to adapt, minimize GI sensitivity, and calculate precise syringe draw units for each stage. (Dose Ramp Up recommendations below!)
          </p>
        </div>

        {/* Mode Switcher: Presets vs Custom Titration */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setPlannerMode('preset')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              plannerMode === 'preset'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Established Presets
          </button>
          <button
            onClick={() => setPlannerMode('custom')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              plannerMode === 'custom'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ Custom Titration Builder
          </button>
        </div>
      </div>

      {/* PRESET MODE: Preset Selector Buttons */}
      {plannerMode === 'preset' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPresetId(preset.id);
                setVialMassMg(preset.vialMassMg);
                setBacWaterMl(preset.bacWaterMl);
                setSyringeType(preset.syringeType);
              }}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition cursor-pointer ${
                selectedPresetId === preset.id
                  ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                  {preset.category}
                </span>
                <span className="font-bold text-sm text-white">{preset.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                <span>{preset.steps.length} Titration Steps</span>
                <span className="text-emerald-300 font-semibold">{preset.frequency}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* CUSTOM TITRATION BUILDER FORM */}
      {plannerMode === 'custom' && (
        <div className="glass-panel p-5 rounded-3xl border-slate-800 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Custom Titration Protocol Details</span>
              </h3>
              <p className="text-[11px] text-slate-400">Configure your custom compound escalation phases</p>
            </div>

            <button
              type="button"
              onClick={handleAddCustomStep}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Escalation Step</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold text-xs uppercase mb-1">Compound Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold text-xs uppercase mb-1">Dosing Frequency</label>
              <input
                type="text"
                value={customFrequency}
                onChange={(e) => setCustomFrequency(e.target.value)}
                placeholder="e.g. Once Weekly, Daily, Every 3.5 Days"
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold text-xs uppercase mb-1">Default Unit</label>
              <select
                value={customUnit}
                onChange={(e) => {
                  const unit = e.target.value as 'mcg' | 'mg';
                  setCustomUnit(unit);
                  setCustomSteps(prev => prev.map(s => ({ ...s, doseUnit: unit })));
                }}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:border-cyan-400 outline-none cursor-pointer"
              >
                <option value="mg">Milligrams (mg)</option>
                <option value="mcg">Micrograms (mcg)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Reconstitution Adjuster (Vial & BAC Water) */}
      <div className="glass-panel p-5 rounded-3xl border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center shadow-xl">
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Powder in Vial (mg)</label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={vialMassMg}
            onChange={(e) => setVialMassMg(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm rounded-xl p-2.5 focus:border-cyan-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Mixing BAC Water (mL)</label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={bacWaterMl}
            onChange={(e) => setBacWaterMl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm rounded-xl p-2.5 focus:border-cyan-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Syringe Type</label>
          <select
            value={syringeType}
            onChange={(e) => setSyringeType(e.target.value as SyringeType)}
            className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:border-cyan-400 outline-none cursor-pointer font-medium"
          >
            <option value="U-100">U-100 (100 units / 1.0 mL)</option>
            <option value="U-50">U-50 (50 units / 0.5 mL)</option>
            <option value="U-30">U-30 (30 units / 0.3 mL)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Reconstituted Concentration</label>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono font-bold text-cyan-400 flex flex-col justify-center">
            <span>{concentrationMgMl.toFixed(2)} mg/mL</span>
            <span className="text-[10px] text-slate-500 font-normal">({mcgPerUnitU100.toFixed(1)} mcg/unit)</span>
          </div>
        </div>
      </div>

      {/* Titration Steps Schedule Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm text-white">
              {plannerMode === 'preset' ? activePreset.name : customName} Escalation Schedule
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Frequency: {plannerMode === 'preset' ? activePreset.frequency : customFrequency}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Timeline</th>
                <th className="p-4">Target Dose</th>
                <th className="p-4">Syringe Draw Units ({syringeType})</th>
                <th className="p-4">Draw Volume</th>
                <th className="p-4">Protocol Objective / Notes</th>
                {plannerMode === 'custom' && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {(plannerMode === 'preset' ? activePreset.steps : customSteps).map((step, idx) => {
                const drawInfo = calculateDraw(step.doseAmount, step.doseUnit);
                const isFirst = idx === 0;

                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition">
                    {/* Timeline */}
                    <td className="p-4 font-bold">
                      {plannerMode === 'preset' ? (
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${isFirst ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                          <span>{step.weekRange}</span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={step.weekRange}
                          onChange={(e) => handleUpdateCustomStep(idx, 'weekRange', e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-bold w-28 focus:border-cyan-400 outline-none"
                        />
                      )}
                    </td>

                    {/* Target Dose */}
                    <td className="p-4">
                      {plannerMode === 'preset' ? (
                        <span className="font-mono font-extrabold text-white text-sm sm:text-base">
                          {step.doseAmount} <span className="text-xs font-normal text-slate-400">{step.doseUnit}</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={step.doseAmount}
                            onChange={(e) => handleUpdateCustomStep(idx, 'doseAmount', Number(e.target.value))}
                            className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono font-bold w-20 focus:border-cyan-400 outline-none"
                          />
                          <span className="text-xs text-slate-400 font-semibold">{step.doseUnit}</span>
                        </div>
                      )}
                    </td>

                    {/* Draw Units */}
                    <td className="p-4">
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-xl font-mono font-bold text-xs sm:text-sm">
                        {drawInfo.units} units
                      </span>
                    </td>

                    {/* Draw Volume */}
                    <td className="p-4 text-slate-400 font-mono text-xs">
                      {drawInfo.ml} mL
                    </td>

                    {/* Description / Clinical Notes */}
                    <td className="p-4 text-xs text-slate-300">
                      {plannerMode === 'preset' ? (
                        step.description
                      ) : (
                        <input
                          type="text"
                          value={step.description}
                          onChange={(e) => handleUpdateCustomStep(idx, 'description', e.target.value)}
                          placeholder="e.g. Initial tolerance check..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 focus:border-cyan-400 outline-none"
                        />
                      )}
                    </td>

                    {/* Delete Custom Row Button */}
                    {plannerMode === 'custom' && (
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          disabled={customSteps.length <= 1}
                          onClick={() => handleRemoveCustomStep(idx)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition disabled:opacity-30 cursor-pointer"
                          title="Remove step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Titration Best Practice Tips */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl flex items-start gap-3 text-xs text-slate-300 shadow-lg">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <strong className="text-white">Titration Golden Rule:</strong>
          <span>Give each dose stage at least 2 to 4 full weeks before stepping up. It takes multiple half-lives for blood levels to reach a steady-state equilibrium. Staying at the minimum effective dose prevents adverse GI side effects and maintains long-term receptor sensitivity.</span>
        </div>
      </div>

    </div>
  );
};
