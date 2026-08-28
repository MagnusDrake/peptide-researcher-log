import React, { useState } from 'react';
import { TrendingUp, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { SyringeType } from '../../types';

interface TitrationPreset {
  id: string;
  name: string;
  category: string;
  vialMassMg: number;
  bacWaterMl: number;
  syringeType: SyringeType;
  steps: {
    weekRange: string;
    doseMg: number;
    description: string;
  }[];
}

const PRESETS: TitrationPreset[] = [
  {
    id: 'tirzepatide-std',
    name: 'Tirzepatide Standard Escalation (SURMOUNT)',
    category: 'GLP-1 / GIP Dual Agonist',
    vialMassMg: 10,
    bacWaterMl: 2.0,
    syringeType: 'U-100',
    steps: [
      { weekRange: 'Weeks 1 - 4', doseMg: 2.5, description: 'Initiation & metabolic acclimation (reduces nausea)' },
      { weekRange: 'Weeks 5 - 8', doseMg: 5.0, description: 'Primary therapeutic step; evaluate glycemic and appetite response' },
      { weekRange: 'Weeks 9 - 12', doseMg: 7.5, description: 'Secondary escalation if plateaued at 5mg' },
      { weekRange: 'Weeks 13 - 16', doseMg: 10.0, description: 'High therapeutic target for significant adiposity reduction' },
      { weekRange: 'Weeks 17 - 20', doseMg: 12.5, description: 'Advanced titration step' },
      { weekRange: 'Weeks 21+', doseMg: 15.0, description: 'Maximum studied clinical maintenance dose' }
    ]
  },
  {
    id: 'semaglutide-std',
    name: 'Semaglutide Standard Escalation (STEP-1)',
    category: 'GLP-1 Selective Agonist',
    vialMassMg: 5,
    bacWaterMl: 2.0,
    syringeType: 'U-100',
    steps: [
      { weekRange: 'Weeks 1 - 4', doseMg: 0.25, description: 'Starting dose for GI tract adaptation (sub-therapeutic)' },
      { weekRange: 'Weeks 5 - 8', doseMg: 0.50, description: 'First step escalation; initial appetite suppression observed' },
      { weekRange: 'Weeks 9 - 12', doseMg: 1.00, description: 'Target therapeutic dose for glycemic & weight control' },
      { weekRange: 'Weeks 13 - 16', doseMg: 1.70, description: 'Higher maintenance step' },
      { weekRange: 'Weeks 17+', doseMg: 2.40, description: 'Full clinical maintenance target dose' }
    ]
  },
  {
    id: 'retatrutide-trial',
    name: 'Retatrutide Research Trial Ramp (Phase 2)',
    category: 'Triple GGG Agonist',
    vialMassMg: 10,
    bacWaterMl: 2.0,
    syringeType: 'U-100',
    steps: [
      { weekRange: 'Weeks 1 - 4', doseMg: 2.0, description: 'Initial tolerance assessment & heart rate monitoring' },
      { weekRange: 'Weeks 5 - 8', doseMg: 4.0, description: 'Moderate metabolic and thermogenic acceleration' },
      { weekRange: 'Weeks 9 - 12', doseMg: 8.0, description: 'High-efficacy fat oxidation & hepatic clearance dose' },
      { weekRange: 'Weeks 13+', doseMg: 12.0, description: 'Maximum studied trial dose' }
    ]
  }
];

export const TitrationPlanner: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tirzepatide-std');
  const [vialMassMg, setVialMassMg] = useState<number | string>(10);
  const [bacWaterMl, setBacWaterMl] = useState<number | string>(2.0);
  const [syringeType, setSyringeType] = useState<SyringeType>('U-100');

  const activePreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const concentrationMgMl = (Number(vialMassMg) || 0) / (Number(bacWaterMl) || 1);
  // Units per mg on U-100 syringe: 100 units = 1 mL -> units per mg = 100 / concentrationMgMl
  const unitsPerMg = concentrationMgMl > 0 ? 100 / concentrationMgMl : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-[0.85rem] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>GLP-1 Dose Ramp-Up Guide</span>
        </h2>
        <p className="text-xs text-slate-400">
          Standard 4-week step-up schedules. Starting with a low dose and slowly ramping up helps your body adjust and avoids nausea or stomach upset.
        </p>
      </div>

      {/* Preset Selector & Vial Config */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => {
              setSelectedPresetId(preset.id);
              setVialMassMg(preset.vialMassMg);
              setBacWaterMl(preset.bacWaterMl);
              setSyringeType(preset.syringeType);
            }}
            className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${
              selectedPresetId === preset.id
                ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              {preset.category}
            </span>
            <span className="font-bold text-sm text-white">{preset.name}</span>
            <span className="text-xs text-slate-400 mt-1">{preset.steps.length} Step-Up Phases</span>
          </button>
        ))}
      </div>

      {/* Interactive Reconstitution Adjuster for this Ramp */}
      <div className="glass-panel p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Powder in Vial (mg)</label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={vialMassMg}
            onChange={(e) => setVialMassMg(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-2.5 focus:border-emerald-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Mixing Water (BAC mL)</label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={bacWaterMl}
            onChange={(e) => setBacWaterMl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-2.5 focus:border-emerald-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Concentration</label>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-mono font-bold text-emerald-400">
            {concentrationMgMl.toFixed(2)} mg/mL ({(((Number(vialMassMg) || 0) * 1000 / (Number(bacWaterMl) || 1)) / 100).toFixed(1)} mcg/unit)
          </div>
        </div>
      </div>

      {/* Titration Steps Schedule Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm text-white">{activePreset.name} Schedule</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Dosing Frequency: Once Weekly (Every 7 Days)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Timeline</th>
                <th className="p-4">Target Dose</th>
                <th className="p-4">Draw Units ({syringeType})</th>
                <th className="p-4">Draw Volume</th>
                <th className="p-4">Clinical Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {activePreset.steps.map((step, idx) => {
                const drawUnits = Number((step.doseMg * unitsPerMg).toFixed(1));
                const volumeMl = (drawUnits * 0.01).toFixed(2);
                const isFirst = idx === 0;

                return (
                  <tr key={step.weekRange} className="hover:bg-slate-900/40 transition">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isFirst ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                      <span>{step.weekRange}</span>
                    </td>
                    <td className="p-4 font-mono font-extrabold text-white text-base">
                      {step.doseMg} <span className="text-xs font-normal text-slate-400">mg</span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-lg font-mono font-bold">
                        {drawUnits} units
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      {volumeMl} mL
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      {step.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Titration Best Practice Tips */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <strong className="text-white">Dose Step-Up Golden Rule:</strong>
          <span>Give each dose at least 4 full weeks before increasing. It takes about a month for levels to build up and stabilize in your body. Staying on the lowest dose that works for you prevents nausea and stomach upset, and keeps the peptide working great long-term.</span>
        </div>
      </div>
    </div>
  );
};
