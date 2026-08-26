import React, { useState } from 'react';
import { Protocol, DoseLogEntry, SyringeType } from '../../types';
import { INJECTION_SITES } from '../../data/injectionSites';
import { SiteRotationMap } from './SiteRotationMap';
import { db } from '../../db';
import confetti from 'canvas-confetti';
import { X, Check, Activity, Sparkles, Shield, Heart, Moon, Zap, Scale, Plus } from 'lucide-react';

interface LogAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocol: Protocol | null;
  onLogSaved: (entry: DoseLogEntry) => void;
  lastUsedSiteName?: string;
}

export const LogAdminModal: React.FC<LogAdminModalProps> = ({
  isOpen,
  onClose,
  protocol,
  onLogSaved,
  lastUsedSiteName,
}) => {
  if (!isOpen || !protocol) return null;

  // Compute default suggested site
  const lastIndex = INJECTION_SITES.findIndex(s => s.name === lastUsedSiteName);
  const defaultSite = lastIndex >= 0 ? INJECTION_SITES[(lastIndex + 1) % INJECTION_SITES.length].name : 'Abdomen - Upper Right';

  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString().slice(0, 16));
  const [doseAmount, setDoseAmount] = useState<number | ''>(protocol.doseAmount);
  const [doseUnit, setDoseUnit] = useState<'mcg' | 'mg'>(protocol.doseUnit);
  const [drawUnits, setDrawUnits] = useState<number | ''>(protocol.calculatedUnits);
  const [syringeType, setSyringeType] = useState<SyringeType>(protocol.syringeType);
  const [injectionSite, setInjectionSite] = useState<string>(defaultSite);
  const [reactionRating, setReactionRating] = useState<'none' | 'mild_redness' | 'bruise' | 'itch' | 'sore'>('none');
  
  // Subjective Research Markers
  const [showSubjective, setShowSubjective] = useState<boolean>(true);
  const [recoveryScore, setRecoveryScore] = useState<number>(8);
  const [energyLevel, setEnergyLevel] = useState<number>(8);
  const [appetiteSuppression, setAppetiteSuppression] = useState<number>(7);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [symptomPainScore, setSymptomPainScore] = useState<number>(2);
  const [bodyWeightLbs, setBodyWeightLbs] = useState<number | ''>('');
  const [notes, setNotes] = useState<string>('');

  const currentUnits = Number(drawUnits) || 0;
  const deliveredBlendList = protocol.isBlend && protocol.blendComponents ? protocol.blendComponents.map(comp => {
    const conc = (comp.vialMassMg * 10) / (protocol.bacWaterMl || 1);
    const deliveredMcg = currentUnits * conc;
    const isMg = comp.doseUnit === 'mg' || deliveredMcg >= 1000;
    return {
      peptideName: comp.peptideName,
      doseAmount: isMg ? Number((deliveredMcg / 1000).toFixed(2)) : Math.round(deliveredMcg),
      doseUnit: (isMg ? 'mg' : 'mcg') as 'mcg' | 'mg'
    };
  }) : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const logEntry: DoseLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      protocolId: protocol.id,
      peptideName: protocol.peptideName,
      isBlend: protocol.isBlend,
      blendDelivered: deliveredBlendList,
      timestamp: new Date(timestamp).toISOString(),
      doseAmount: Number(doseAmount) || 0,
      doseUnit,
      drawUnits: Number(drawUnits) || 0,
      syringeType,
      injectionSite,
      reactionRating,
      notes: notes.trim(),
      subjectiveMetrics: showSubjective ? {
        recoveryScore,
        energyLevel,
        appetiteSuppression,
        sleepQuality,
        symptomPainScore,
        bodyWeightLbs: bodyWeightLbs === '' ? undefined : Number(bodyWeightLbs)
      } : undefined,
      isPublic: protocol.isPublic
    };

    await db.doseLogs.put(logEntry);

    // Update protocol remaining units if applicable
    if (protocol.remainingVialUnits !== undefined && protocol.remainingVialUnits > 0) {
      const updatedRemaining = Math.max(0, protocol.remainingVialUnits - (Number(drawUnits) || 0));
      await db.protocols.update(protocol.id, { remainingVialUnits: updatedRemaining });
    }

    // Celebration burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onLogSaved(logEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Administer Research Injection
            </span>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>{protocol.peptideName}</span>
              {protocol.isBlend && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-normal">
                  🧪 Stack ({protocol.blendComponents?.length || 2} Peptides)
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blend Multi-Compound Delivered Alert */}
        {protocol.isBlend && deliveredBlendList && deliveredBlendList.length > 0 && (
          <div className="mx-6 mt-4 p-3 bg-purple-950/40 border border-purple-800/60 rounded-2xl flex flex-col gap-1.5">
            <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🧪</span>
              <span>Delivering {deliveredBlendList.length} Compounds Simultaneously:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {deliveredBlendList.map((d, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-slate-900 text-purple-200 rounded-lg border border-purple-900/60 font-medium">
                  <strong className="text-white">{d.peptideName}:</strong> <span className="font-mono text-cyan-300">{d.doseAmount} {d.doseUnit}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-slate-300">
          
          {/* Timestamp & Site */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold uppercase mb-1">Date & Time</label>
              <input
                type="datetime-local"
                required
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold uppercase mb-1">Injection Site</label>
              <select
                value={injectionSite}
                onChange={(e) => setInjectionSite(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-cyan-400 outline-none font-medium"
              >
                {INJECTION_SITES.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name} {s.name === lastUsedSiteName ? '(Last Used)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Site Picker Visualizer */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Site Selection</span>
            <div className="flex flex-wrap gap-1.5">
              {INJECTION_SITES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setInjectionSite(s.name)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    injectionSite === s.name
                      ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dose check */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-semibold uppercase mb-1">Administered Dose</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={doseAmount}
                onChange={(e) => setDoseAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm rounded-lg p-2 focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold uppercase mb-1">Unit</label>
              <select
                value={doseUnit}
                onChange={(e) => setDoseUnit(e.target.value as 'mcg' | 'mg')}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg p-2 focus:border-cyan-400 outline-none"
              >
                <option value="mcg">mcg</option>
                <option value="mg">mg</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold uppercase mb-1">Syringe Units</label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={drawUnits}
                onChange={(e) => setDrawUnits(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-cyan-400 font-mono font-bold text-sm rounded-lg p-2 focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* Local Site Reaction Rating */}
          <div>
            <label className="block text-slate-400 font-semibold uppercase mb-1.5">
              Localized Subcutaneous Reaction
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'none', label: 'None / Normal' },
                { id: 'mild_redness', label: 'Mild Redness' },
                { id: 'bruise', label: 'Small Bruise' },
                { id: 'itch', label: 'Transient Itch' },
                { id: 'sore', label: 'Post-Inj Soreness' }
              ].map(rx => (
                <button
                  key={rx.id}
                  type="button"
                  onClick={() => setReactionRating(rx.id as any)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition ${
                    reactionRating === rx.id
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rx.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subjective Research Markers (Collapsible / Toggle) */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Subjective Research Biometrics
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSubjective(!showSubjective)}
                className="text-xs text-cyan-400 hover:underline"
              >
                {showSubjective ? 'Hide Metrics' : 'Show Metrics'}
              </button>
            </div>

            {showSubjective && (
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-800/80">
                {/* Recovery Score Slider */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Recovery & Tissue Sensation:</span>
                    <span className="text-emerald-400 font-bold font-mono">{recoveryScore} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={recoveryScore}
                    onChange={(e) => setRecoveryScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                {/* Energy Level Slider */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Energy & Stamina:</span>
                    <span className="text-cyan-400 font-bold font-mono">{energyLevel} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Sleep Quality Slider */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Sleep Quality & Restfulness:</span>
                    <span className="text-purple-400 font-bold font-mono">{sleepQuality} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>

                {/* Body weight optional */}
                <div className="pt-2">
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Body Weight (lbs) <span className="text-slate-500 font-normal">(Optional)</span></label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 182.4"
                    value={bodyWeightLbs}
                    onChange={(e) => setBodyWeightLbs(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Observation Notes */}
          <div>
            <label className="block text-slate-400 font-semibold uppercase mb-1">Observations & Research Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Administered smoothly with 31G needle. Zero PIP. Observed strong appetite suppression throughout afternoon."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-cyan-400 outline-none resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Record Administration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
