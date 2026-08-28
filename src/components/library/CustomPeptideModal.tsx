import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Peptide, PeptideCategory } from '../../types';
import { X, Plus, Sparkles, Layers, Trash2 } from 'lucide-react';
import { db } from '../../db';

interface CustomPeptideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPeptideCreated: (newPeptide: Peptide) => void;
}

export const CustomPeptideModal: React.FC<CustomPeptideModalProps> = ({
  isOpen,
  onClose,
  onPeptideCreated,
}) => {
  const [isBlend, setIsBlend] = useState<boolean>(false);
  const [blendRows, setBlendRows] = useState<Array<{ id: string; name: string; massRatioMg: number }>>([
    { id: 'br-1', name: 'BPC-157', massRatioMg: 5 },
    { id: 'br-2', name: 'TB-500', massRatioMg: 5 },
  ]);

  const [name, setName] = useState<string>('');
  const [aliases, setAliases] = useState<string>('');
  const [category, setCategory] = useState<PeptideCategory>('other');
  const [summary, setSummary] = useState<string>('');
  const [mechanism, setMechanism] = useState<string>('');
  const [vialSizes, setVialSizes] = useState<string>('5, 10');
  const [typicalDose, setTypicalDose] = useState<number | string>(500);
  const [doseUnit, setDoseUnit] = useState<'mcg' | 'mg'>('mcg');
  const [frequency, setFrequency] = useState<string>('Once daily');
  const [halfLifeHours, setHalfLifeHours] = useState<number | string>(4);
  const [indications, setIndications] = useState<string>('Tissue repair, Vitality');

  if (!isOpen) return null;

  const handleAddBlendRow = () => {
    setBlendRows([
      ...blendRows,
      { id: `br-${Date.now()}`, name: `Peptide #${blendRows.length + 1}`, massRatioMg: 5 }
    ]);
  };

  const handleRemoveBlendRow = (id: string) => {
    if (blendRows.length <= 2) return;
    setBlendRows(blendRows.filter(r => r.id !== id));
  };

  const handleUpdateBlendRow = (id: string, field: 'name' | 'massRatioMg', value: any) => {
    setBlendRows(blendRows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalName = isBlend 
      ? (name.trim() || blendRows.map(r => r.name).join(' + ') + ' Blend')
      : name.trim();

    if (!finalName) return;

    const id = `custom-${finalName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
    const categoryLabels: Record<PeptideCategory, string> = {
      healing: 'Tissue & Gut Repair',
      metabolic: 'Incretin & Weight Management',
      gh_secretagogue: 'Growth Hormone & Anabolism',
      longevity: 'Longevity & Anti-Aging',
      nootropic: 'Cognitive & Neuroprotective',
      cosmetic: 'Skin, Hair & Aesthetics',
      immune: 'Immune & Cellular Defense',
      other: isBlend ? 'Multi-Peptide Blend' : 'Custom Compound'
    };

    const totalBlendMg = isBlend ? blendRows.reduce((sum, r) => sum + (Number(r.massRatioMg) || 0), 0) : 10;
    const computedVialSizes = isBlend 
      ? [totalBlendMg]
      : vialSizes.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n > 0);

    const newPeptide: Peptide = {
      id,
      name: finalName,
      aliases: aliases.split(',').map(s => s.trim()).filter(Boolean),
      category: isBlend ? 'other' : category,
      categoryLabel: isBlend ? 'Multi-Peptide Stack' : (categoryLabels[category] || 'Custom'),
      summary: summary.trim() || (isBlend ? `Formulated multi-peptide stack containing ${blendRows.map(r => `${r.name} (${r.massRatioMg}mg)`).join(' + ')}.` : 'Custom user research compound.'),
      mechanism: mechanism.trim() || (isBlend ? 'Synergistic multi-compound cellular pathways.' : 'User defined mechanism of action.'),
      commonVialSizesMg: computedVialSizes.length > 0 ? computedVialSizes : [10],
      typicalBacWaterMl: [2.0, 3.0],
      reconstitutionTips: ['Handle with gentle swirling to protect all multi-compound peptide bonds.'],
      storageGuidance: {
        lyophilized: 'Store dry at -20°C.',
        reconstituted: 'Refrigerate at 2-8°C and protect from light.',
        shelfLifeReconstitutedDays: 28,
        lightSensitive: true
      },
      standardDosing: {
        minDose: (Number(typicalDose) || 500) * 0.5,
        maxDose: (Number(typicalDose) || 500) * 1.5,
        typicalDose: Number(typicalDose) || 500,
        unit: doseUnit,
        frequency,
        timing: 'Morning fasted'
      },
      halfLifeHours: Number(halfLifeHours) || 4,
      halfLifeLabel: `~${Number(halfLifeHours) || 4} hours`,
      researchIndications: indications.split(',').map(s => s.trim()).filter(Boolean),
      synergisticWith: isBlend ? blendRows.map(r => r.name) : [],
      sideEffectWarnings: ['Monitor research tolerance across all constituent compounds.'],
      literatureReferences: [],
      isCustom: true,
      isBlend,
      blendComponents: isBlend ? blendRows.map(r => ({ name: r.name, massRatioMg: Number(r.massRatioMg) || 0 })) : undefined
    };

    await db.customPeptides.put(newPeptide);
    onPeptideCreated(newPeptide);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isBlend ? <Layers className="w-5 h-5 text-purple-400" /> : <Sparkles className="w-5 h-5 text-cyan-400" />}
            <h2 className="text-lg sm:text-[0.85rem] font-bold text-white uppercase tracking-widest">
              {isBlend ? 'Create Custom Multi-Peptide Stack' : 'Add Custom Research Peptide'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Blend vs Single Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-2">
            <button
              type="button"
              onClick={() => setIsBlend(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                !isBlend ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Single Peptide</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBlend(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isBlend ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🧪 Multi-Peptide Blend (2, 3, 4+)</span>
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              {isBlend ? 'Stack / Blend Name' : 'Peptide Name'}
            </label>
            <input
              type="text"
              required
              placeholder={isBlend ? 'e.g. Wolverine Blend or Custom Synergist Stack' : 'e.g. Epithalon, Retatrutide, KPV'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Multi-Peptide Constituents if Blend */}
          {isBlend && (
            <div className="space-y-2.5 p-3.5 bg-purple-950/20 border border-purple-900/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Constituent Peptides & Milligram Ratios ({blendRows.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddBlendRow}
                  className="flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white bg-purple-900/80 px-2 py-0.5 rounded-lg transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Row</span>
                </button>
              </div>

              {blendRows.map((r, idx) => (
                <div key={r.id} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Peptide name"
                    value={r.name}
                    onChange={(e) => handleUpdateBlendRow(r.id, 'name', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-lg p-2 focus:border-purple-400 outline-none"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      placeholder="mg"
                      value={r.massRatioMg}
                      onChange={(e) => handleUpdateBlendRow(r.id, 'massRatioMg', e.target.value)}
                      className="w-16 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 text-right focus:border-purple-400 outline-none font-mono"
                    />
                    <span className="text-xs text-slate-400 font-bold">mg</span>
                  </div>
                  {blendRows.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBlendRow(r.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isBlend && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PeptideCategory)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                >
                  <option value="healing">Tissue & Gut Repair</option>
                  <option value="metabolic">Incretin & Weight</option>
                  <option value="gh_secretagogue">Growth Hormone Axis</option>
                  <option value="longevity">Longevity & Mitochondria</option>
                  <option value="nootropic">Nootropic & Cognitive</option>
                  <option value="cosmetic">Skin & Aesthetic</option>
                  <option value="immune">Immune & Defense</option>
                  <option value="other">Custom / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Vial Sizes Available (mg)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5, 10, 20"
                  value={vialSizes}
                  onChange={(e) => setVialSizes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Dosing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 uppercase">Typical Research Dose</label>
                <div className="flex bg-slate-950 rounded border border-slate-700 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      if (doseUnit === 'mg') {
                        setDoseUnit('mcg');
                        if (typicalDose !== '') setTypicalDose(Number(typicalDose) * 1000);
                      }
                    }}
                    className={`px-1.5 py-0.5 font-bold ${doseUnit === 'mcg' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
                  >
                    mcg
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (doseUnit === 'mcg') {
                        setDoseUnit('mg');
                        if (typicalDose !== '') setTypicalDose(Number(typicalDose) / 1000);
                      }
                    }}
                    className={`px-1.5 py-0.5 font-bold ${doseUnit === 'mg' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
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
                value={typicalDose}
                onChange={(e) => setTypicalDose(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Estimated Half-Life (Hours)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={halfLifeHours}
                onChange={(e) => setHalfLifeHours(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Summary / Research Focus
            </label>
            <textarea
              rows={2}
              placeholder="Primary biological mechanism or research targets..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 btn-glow-cyan hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Compound to Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
