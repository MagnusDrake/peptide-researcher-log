import React, { useState, useEffect } from 'react';
import { Protocol, SyringeType, FrequencyType, TimingOfDay, BlendComponent } from '../../types';
import { PEPTIDES_DATABASE } from '../../data/peptides';
import { calculateReconstitution, calculateMultiBlend } from '../../utils/calculations';
import { db } from '../../db';
import { X, Check, Sparkles, Calendar, Clock, DollarSign, Share2, Layers, Plus, Trash2 } from 'lucide-react';

interface ProtocolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (protocol: Protocol) => void;
  editingProtocol?: Protocol | null;
  initialData?: Partial<Protocol> | null;
}

const DAYS_OF_WEEK = [
  { id: 1, label: 'Mon', full: 'Monday' },
  { id: 2, label: 'Tue', full: 'Tuesday' },
  { id: 3, label: 'Wed', full: 'Wednesday' },
  { id: 4, label: 'Thu', full: 'Thursday' },
  { id: 5, label: 'Fri', full: 'Friday' },
  { id: 6, label: 'Sat', full: 'Saturday' },
  { id: 0, label: 'Sun', full: 'Sunday' },
];

export const ProtocolFormModal: React.FC<ProtocolFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  editingProtocol,
  initialData,
}) => {
  const [isBlend, setIsBlend] = useState<boolean>(false);
  const [blendComponents, setBlendComponents] = useState<BlendComponent[]>([
    { id: 'bc-1', peptideName: 'BPC-157', vialMassMg: 5, targetDose: 250, doseUnit: 'mcg' },
    { id: 'bc-2', peptideName: 'TB-500', vialMassMg: 5, targetDose: 250, doseUnit: 'mcg' }
  ]);
  const [primaryBlendId, setPrimaryBlendId] = useState<string>('bc-1');

  const [peptideId, setPeptideId] = useState<string>('bpc-157');
  const [peptideName, setPeptideName] = useState<string>('BPC-157');
  const [brandName, setBrandName] = useState<string>('');
  const [batchNumber, setBatchNumber] = useState<string>('');
  
  const [vialMassMg, setVialMassMg] = useState<number | string>(5);
  const [bacWaterMl, setBacWaterMl] = useState<number | string>(2.0);
  const [doseAmount, setDoseAmount] = useState<number | string>(250);
  const [doseUnit, setDoseUnit] = useState<'mcg' | 'mg'>('mcg');
  const [syringeType, setSyringeType] = useState<SyringeType>('U-100');
  
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('days_of_week');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default
  const [timingOfDay, setTimingOfDay] = useState<TimingOfDay>('fasted_morning');
  
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reconstitutedDate, setReconstitutedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [plannedCycleWeeks, setPlannedCycleWeeks] = useState<number | string>(6);
  const [costPerVial, setCostPerVial] = useState<number | string>('');
  const [notes, setNotes] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [shareAlias, setShareAlias] = useState<string>('');

  useEffect(() => {
    if (editingProtocol) {
      setIsBlend(!!editingProtocol.isBlend);
      if (editingProtocol.blendComponents && editingProtocol.blendComponents.length > 0) {
        setBlendComponents(editingProtocol.blendComponents);
        setPrimaryBlendId(editingProtocol.blendComponents[0].id);
      }
      setPeptideId(editingProtocol.peptideId);
      setPeptideName(editingProtocol.peptideName);
      setBrandName(editingProtocol.brandName || '');
      setBatchNumber(editingProtocol.batchNumber || '');
      setVialMassMg(editingProtocol.vialMassMg);
      setBacWaterMl(editingProtocol.bacWaterMl);
      setDoseAmount(editingProtocol.doseAmount);
      setDoseUnit(editingProtocol.doseUnit);
      setSyringeType(editingProtocol.syringeType);
      setFrequencyType(editingProtocol.frequencyType);
      setDaysOfWeek(editingProtocol.daysOfWeek || [1, 3, 5]);
      setTimingOfDay(editingProtocol.timingOfDay);
      setStartDate(editingProtocol.startDate);
      setReconstitutedDate(editingProtocol.reconstitutedDate || editingProtocol.startDate);
      setPlannedCycleWeeks(editingProtocol.plannedCycleWeeks);
      setCostPerVial(editingProtocol.costPerVial || '');
      setNotes(editingProtocol.notes || '');
      setIsPublic(editingProtocol.isPublic || false);
      setShareAlias(editingProtocol.shareAlias || '');
    } else if (initialData) {
      if (initialData.isBlend) {
        setIsBlend(true);
        if (initialData.blendComponents && initialData.blendComponents.length > 0) {
          setBlendComponents(initialData.blendComponents.map(c => ({
            ...c,
            targetDose: c.doseUnit === 'mg' ? Number((Number(c.targetDose) || 0).toFixed(2)) : Math.round(Number(c.targetDose) || 0)
          })));
          setPrimaryBlendId(initialData.blendComponents[0].id);
        }
      }
      if (initialData.peptideId) setPeptideId(initialData.peptideId);
      if (initialData.peptideName) setPeptideName(initialData.peptideName);
      if (initialData.brandName) setBrandName(initialData.brandName);
      if (initialData.vialMassMg) setVialMassMg(initialData.vialMassMg);
      if (initialData.bacWaterMl) setBacWaterMl(initialData.bacWaterMl);
      if (initialData.doseAmount) setDoseAmount(initialData.doseAmount);
      if (initialData.doseUnit) setDoseUnit(initialData.doseUnit);
      if (initialData.syringeType) setSyringeType(initialData.syringeType);
      if (initialData.costPerVial) setCostPerVial(initialData.costPerVial);
    }
  }, [editingProtocol, initialData, isOpen]);

  // When peptide dropdown changes (Single Mode)
  const handlePeptideSelect = (id: string) => {
    setPeptideId(id);
    if (id === 'custom') {
      setPeptideName('');
    } else {
      const pep = PEPTIDES_DATABASE.find(p => p.id === id);
      if (pep) {
        setPeptideName(pep.name);
        if (pep.commonVialSizesMg.length > 0) setVialMassMg(pep.commonVialSizesMg[0]);
        if (pep.typicalBacWaterMl.length > 0) setBacWaterMl(pep.typicalBacWaterMl[0]);
        setDoseUnit(pep.standardDosing.unit);
        setDoseAmount(pep.standardDosing.typicalDose);
      }
    }
  };

  const toggleDay = (dayId: number) => {
    if (daysOfWeek.includes(dayId)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== dayId));
    } else {
      setDaysOfWeek([...daysOfWeek, dayId].sort());
    }
  };

  // Blend row operations
  const handleAddBlendRow = () => {
    const newId = `bc-${Date.now()}`;
    setBlendComponents([
      ...blendComponents,
      {
        id: newId,
        peptideName: `Peptide #${blendComponents.length + 1}`,
        vialMassMg: 5,
        targetDose: 250,
        doseUnit: 'mcg'
      }
    ]);
  };

  const handleRemoveBlendRow = (id: string) => {
    if (blendComponents.length <= 2) return;
    const next = blendComponents.filter(c => c.id !== id);
    setBlendComponents(next);
    if (primaryBlendId === id && next.length > 0) {
      setPrimaryBlendId(next[0].id);
    }
  };

  const handleUpdateBlendRow = (id: string, field: keyof BlendComponent, value: any) => {
    setBlendComponents(blendComponents.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Calculations
  const singleCalc = calculateReconstitution({
    vialMassMg: Number(vialMassMg) || 0,
    bacWaterMl: Number(bacWaterMl) || 0,
    targetDose: Number(doseAmount) || 0,
    doseUnit,
    syringeType,
    vialCost: costPerVial === '' ? undefined : Number(costPerVial)
  });

  const primaryComp = blendComponents.find(c => c.id === primaryBlendId) || blendComponents[0];

  const blendCalc = calculateMultiBlend({
    components: blendComponents.map(c => ({
      id: c.id,
      peptideName: c.peptideName,
      vialMassMg: Number(c.vialMassMg) || 0,
      targetDose: Number(c.targetDose) || 0,
      doseUnit: c.doseUnit
    })),
    bacWaterMl: Number(bacWaterMl) || 0,
    primaryComponentId: primaryComp?.id || 'bc-1',
    targetPrimaryDose: Number(primaryComp?.targetDose) || 0,
    primaryDoseUnit: primaryComp?.doseUnit || 'mcg',
    syringeType,
    vialCost: costPerVial === '' ? undefined : Number(costPerVial)
  });

  const calculatedUnits = isBlend ? blendCalc.drawUnits : singleCalc.drawUnits;
  const concentrationMgMl = isBlend ? (blendCalc.totalVialMassMg / (Number(bacWaterMl) || 1)) : singleCalc.concentrationMgMl;

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalProtocolName = isBlend 
      ? (peptideName || blendComponents.map(c => c.peptideName).join(' + '))
      : peptideName;

    const protocolToSave: Protocol = {
      id: editingProtocol ? editingProtocol.id : `proto-${Date.now()}`,
      peptideId: isBlend ? 'custom-blend' : peptideId,
      peptideName: finalProtocolName,
      customPeptide: isBlend ? true : peptideId === 'custom',
      isBlend,
      blendComponents: isBlend ? blendCalc.components.map(c => ({
        id: c.id,
        peptideName: c.peptideName,
        vialMassMg: c.vialMassMg,
        targetDose: c.targetDose,
        doseUnit: c.doseUnit,
        deliveredDose: c.deliveredDoseMcg >= 1000 ? Number((c.deliveredDoseMcg / 1000).toFixed(2)) : Number(c.deliveredDoseMcg.toFixed(1)),
        deliveredUnit: c.deliveredDoseMcg >= 1000 ? 'mg' : 'mcg'
      })) : undefined,
      brandName: brandName.trim(),
      batchNumber: batchNumber.trim() || undefined,
      vialMassMg: isBlend ? blendCalc.totalVialMassMg : Number(vialMassMg) || 0,
      bacWaterMl: Number(bacWaterMl) || 0,
      doseAmount: isBlend ? (Number(primaryComp?.targetDose) || 0) : (Number(doseAmount) || 0),
      doseUnit: isBlend ? (primaryComp?.doseUnit || 'mcg') : doseUnit,
      syringeType,
      calculatedUnits,
      concentrationMgMl,
      frequencyType,
      daysOfWeek,
      timingOfDay,
      startDate,
      reconstitutedDate,
      plannedCycleWeeks: Number(plannedCycleWeeks) || 6,
      costPerVial: costPerVial === '' ? undefined : Number(costPerVial),
      notes: notes.trim() || undefined,
      isActive: editingProtocol ? editingProtocol.isActive : true,
      isPublic,
      shareAlias: isPublic ? (shareAlias.trim() || undefined) : undefined,
    };

    await db.protocols.put(protocolToSave);

    onSaved(protocolToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              {isBlend ? <Layers className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {editingProtocol ? 'Edit Research Protocol' : 'Create New Research Protocol'}
              </h2>
              <p className="text-xs text-slate-400">
                {isBlend ? 'Configure multi-peptide stack formulated in a single vial' : 'Configure compound parameters, reconstitution volume, and schedule'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Vial Type Selector: Single vs Multi-Peptide Stack */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setIsBlend(false)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                !isBlend ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Single Peptide Vial</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBlend(true)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                isBlend ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>🧪 Multi-Peptide Stack Vial (2, 3, 4+)</span>
            </button>
          </div>

          {/* Section 1: Compound Parameters */}
          {!isBlend ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                1. Single Compound & Reconstitution Parameters
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Select Peptide
                </label>
                <select
                  value={peptideId}
                  onChange={(e) => handlePeptideSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                >
                  <optgroup label="Popular Research Peptides">
                    {PEPTIDES_DATABASE.map(pep => (
                      <option key={pep.id} value={pep.id}>
                        {pep.name} ({pep.categoryLabel})
                      </option>
                    ))}
                  </optgroup>
                  <option value="custom">✨ Custom / Unlisted Peptide</option>
                </select>
              </div>

              {peptideId === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Custom Peptide Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Proprietary Blend or Research Compound"
                    value={peptideName}
                    onChange={(e) => setPeptideName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Vial Mass (mg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    placeholder="0"
                    value={vialMassMg}
                    onChange={(e) => setVialMassMg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    BAC Water Added (mL)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    placeholder="0"
                    value={bacWaterMl}
                    onChange={(e) => setBacWaterMl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Target Dose & Syringe */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase">Target Dose</label>
                    <div className="flex bg-slate-950 rounded border border-slate-700 text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          if (doseUnit === 'mg') {
                            setDoseUnit('mcg');
                            if (doseAmount !== '') setDoseAmount(Number(doseAmount) * 1000);
                          }
                        }}
                        className={`px-2 py-0.5 font-bold ${doseUnit === 'mcg' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
                      >
                        mcg
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (doseUnit === 'mcg') {
                            setDoseUnit('mg');
                            if (doseAmount !== '') setDoseAmount(Number(doseAmount) / 1000);
                          }
                        }}
                        className={`px-2 py-0.5 font-bold ${doseUnit === 'mg' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
                      >
                        mg
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    placeholder="0"
                    value={doseAmount}
                    onChange={(e) => setDoseAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Syringe Size
                  </label>
                  <select
                    value={syringeType}
                    onChange={(e) => setSyringeType(e.target.value as SyringeType)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="U-100">U-100 (1.0 mL)</option>
                    <option value="U-50">U-50 (0.5 mL)</option>
                    <option value="U-30">U-30 (0.3 mL)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Peptide Blend Form */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  1. Multi-Peptide Stack Constituents ({blendComponents.length} Peptides in Vial)
                </h3>
                <button
                  type="button"
                  onClick={handleAddBlendRow}
                  className="flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white bg-purple-950 hover:bg-purple-900 px-2.5 py-1 rounded-lg border border-purple-800 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Peptide</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Stack Vial Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wolverine Blend, Super Glow Stack, Incretin+B12"
                  value={peptideName}
                  onChange={(e) => setPeptideName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:border-purple-400 outline-none"
                />
              </div>

              {/* Dynamic Rows */}
              <div className="space-y-2.5">
                {blendComponents.map((comp, idx) => (
                  <div key={comp.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          required
                          value={comp.peptideName}
                          onChange={(e) => handleUpdateBlendRow(comp.id, 'peptideName', e.target.value)}
                          placeholder={`Peptide #${idx + 1} Name`}
                          className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-bold rounded-lg px-2.5 py-1.5 focus:border-purple-400 outline-none w-48 sm:w-56"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPrimaryBlendId(comp.id)}
                          className={`text-[10px] px-2 py-1 rounded-md font-bold transition ${
                            comp.id === primaryBlendId
                              ? 'bg-purple-500 text-white shadow-sm'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {comp.id === primaryBlendId ? 'Primary Driver' : 'Set as Driver'}
                        </button>
                        {blendComponents.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBlendRow(comp.id)}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-0.5">Powder in Vial (mg)</label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          required
                          placeholder="0"
                          value={comp.vialMassMg}
                          onChange={(e) => handleUpdateBlendRow(comp.id, 'vialMassMg', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 focus:border-purple-400 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <label className="text-[10px] text-slate-400 uppercase">Target Dose</label>
                          <div className="flex bg-slate-900 rounded border border-slate-700 text-[9px]">
                            <button
                              type="button"
                              onClick={() => handleUpdateBlendRow(comp.id, 'doseUnit', 'mcg')}
                              className={`px-1.5 py-0.5 font-bold ${comp.doseUnit === 'mcg' ? 'bg-purple-500 text-white' : 'text-slate-400'}`}
                            >
                              mcg
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateBlendRow(comp.id, 'doseUnit', 'mg')}
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
                          required
                          placeholder="0"
                          value={comp.targetDose}
                          onChange={(e) => handleUpdateBlendRow(comp.id, 'targetDose', e.target.value)}
                          className={`w-full bg-slate-900 border text-white text-xs rounded-lg p-2 outline-none font-mono ${
                            comp.id === primaryBlendId ? 'border-purple-500' : 'border-slate-700'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* BAC Water & Syringe */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    BAC Water Added (mL)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    placeholder="0"
                    value={bacWaterMl}
                    onChange={(e) => setBacWaterMl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:border-purple-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Syringe Size
                  </label>
                  <select
                    value={syringeType}
                    onChange={(e) => setSyringeType(e.target.value as SyringeType)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:border-purple-400 outline-none"
                  >
                    <option value="U-100">U-100 (1.0 mL)</option>
                    <option value="U-50">U-50 (0.5 mL)</option>
                    <option value="U-30">U-30 (0.3 mL)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Live Calculated Draw Banner */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Calculated Syringe Draw</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {calculatedUnits} <span className="text-xs font-bold text-slate-300 uppercase">{syringeType} units</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Volume: {(calculatedUnits * 0.01).toFixed(2)} mL
              </span>
            </div>

            {isBlend && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Vial Powder</span>
                <div className="text-sm font-bold text-purple-300 font-mono">
                  {blendCalc.totalVialMassMg} mg ({blendComponents.length} peptides)
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {blendCalc.totalDosesInVial} doses per vial
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Frequency & Schedule */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              2. Administration Schedule & Frequency
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Frequency Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'days_of_week', label: 'Selected Days' },
                  { id: 'daily', label: 'Every Day (7x)' },
                  { id: 'weekly', label: 'Once Weekly' },
                ].map(freq => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFrequencyType(freq.id as FrequencyType)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      frequencyType === freq.id
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {frequencyType === 'days_of_week' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Select Days of the Week
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        daysOfWeek.includes(day.id)
                          ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Timing of Day
                </label>
                <select
                  value={timingOfDay}
                  onChange={(e) => setTimingOfDay(e.target.value as TimingOfDay)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                >
                  <option value="fasted_morning">Fasted Morning</option>
                  <option value="morning">Morning (With Food)</option>
                  <option value="pre_workout">Pre-Workout (30-45m)</option>
                  <option value="post_workout">Post-Workout</option>
                  <option value="evening">Evening</option>
                  <option value="bedtime">Before Sleep / Bedtime</option>
                  <option value="anytime">Anytime</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Planned Cycle Length
                </label>
                <select
                  value={plannedCycleWeeks}
                  onChange={(e) => setPlannedCycleWeeks(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                >
                  <option value={4}>4 Weeks (Short Blast)</option>
                  <option value={6}>6 Weeks (Standard)</option>
                  <option value={8}>8 Weeks</option>
                  <option value={12}>12 Weeks</option>
                  <option value={16}>16 Weeks</option>
                  <option value={24}>24 Weeks</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Reconstituted Date
                </label>
                <input
                  type="date"
                  value={reconstitutedDate}
                  onChange={(e) => setReconstitutedDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Protocol Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Optional Details */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Vial Tracking & Research Notes (Optional)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Brand / Supplier
                </label>
                <input
                  type="text"
                  placeholder="e.g. Peptide Sciences"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Cost per Vial ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 50"
                  value={costPerVial}
                  onChange={(e) => setCostPerVial(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Research Notes / Hypothesis
              </label>
              <textarea
                rows={2}
                placeholder="Add protocol objectives, synergistic co-factors, or specific research targets..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm rounded-xl p-2.5 focus:border-cyan-400 resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 btn-glow-cyan hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{editingProtocol ? 'Update Protocol' : 'Save Protocol'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
