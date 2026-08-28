import React, { useState } from 'react';
import { Peptide, MatchResult, CuratedStack } from '../../types';
import { PEPTIDES_DATABASE } from '../../data/peptides';
import { CURATED_STACKS } from '../../data/stacks';
import { CuratedStacks } from './CuratedStacks';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  Layers, 
  Activity, 
  PlusCircle, 
  Calculator,
  ChevronRight
} from 'lucide-react';

interface PeptideMatcherProps {
  onOpenInCalculator: (peptide: Peptide) => void;
  onAddToProtocol: (peptide: Peptide) => void;
  onAdoptStack?: (stack: CuratedStack, asSingleBlend?: boolean) => void;
}

const GOALS_LIST = [
  { id: 'fat_loss', label: 'Fat Loss & Metabolic Control', icon: '🔥', description: 'Appetite reduction, incretins, lipolysis, insulin sensitivity' },
  { id: 'joint_repair', label: 'Joint, Tendon & Gut Repair', icon: '🩹', description: 'Angiogenesis, collagen synthesis, ligament recovery, mucosal healing' },
  { id: 'muscle_gh', label: 'Muscle Mass & Growth Hormone', icon: '💪', description: 'Endogenous somatotropin pulses, lean tissue, deep sleep' },
  { id: 'longevity', label: 'Anti-Aging & Cellular Longevity', icon: '🧬', description: 'Telomerase activation, mitochondrial biogenesis, NAD+ restoration' },
  { id: 'cognition', label: 'Cognitive Focus & BDNF Plasticity', icon: '🧠', description: 'Synaptogenesis, neuroprotection, mental clarity, memory retention' },
  { id: 'skin_hair', label: 'Skin Glow, Hair & Aesthetics', icon: '✨', description: 'Copper remodeling, dermal matrix, eumelanin tanning' },
  { id: 'stress_sleep', label: 'Deep Sleep & Stress Modulation', icon: '🌙', description: 'GABAergic balance, Stage 4 sleep architecture, anxiolysis' },
  { id: 'libido', label: 'Libido & Sexual Vitality', icon: '⚡', description: 'Central melanocortin MC4R stimulation, neurotransmitter arousal' },
];

export const PeptideMatcher: React.FC<PeptideMatcherProps> = ({
  onOpenInCalculator,
  onAddToProtocol,
  onAdoptStack,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'stacks'>('quiz');
  const [step, setStep] = useState<number>(1);

  // Quiz State
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [adminPreference, setAdminPreference] = useState<'subq_daily' | 'subq_weekly' | 'nasal_topical' | 'any'>('any');
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const calculateMatches = () => {
    const scoredList: MatchResult[] = [];

    PEPTIDES_DATABASE.forEach(pep => {
      let score = 0;
      const matchedGoals: string[] = [];

      // Check goals
      if (selectedGoals.includes('fat_loss') && (pep.category === 'metabolic' || pep.id === 'aod-9604' || pep.id === 'mots-c' || pep.id === 'tesamorelin')) {
        score += 35;
        matchedGoals.push('Metabolic & Fat Loss');
      }

      if (selectedGoals.includes('joint_repair') && (pep.category === 'healing' || pep.id === 'bpc-157' || pep.id === 'tb-500' || pep.id === 'ghk-cu' || pep.id === 'kpv')) {
        score += 35;
        matchedGoals.push('Tissue & Tendon Healing');
      }

      if (selectedGoals.includes('muscle_gh') && (pep.category === 'gh_secretagogue' || pep.id === 'cjc-1295-no-dac' || pep.id === 'ipamorelin' || pep.id === 'tesamorelin' || pep.id === 'sermorelin')) {
        score += 35;
        matchedGoals.push('Growth Hormone & Recovery');
      }

      if (selectedGoals.includes('longevity') && (pep.category === 'longevity' || pep.id === 'epithalon' || pep.id === 'mots-c' || pep.id === 'ss-31' || pep.id === 'nad-plus')) {
        score += 35;
        matchedGoals.push('Cellular Longevity & Telomeres');
      }

      if (selectedGoals.includes('cognition') && (pep.category === 'nootropic' || pep.id === 'semax' || pep.id === 'selank' || pep.id === 'dihexa')) {
        score += 35;
        matchedGoals.push('Cognitive & Neuroplasticity');
      }

      if (selectedGoals.includes('skin_hair') && (pep.category === 'cosmetic' || pep.id === 'ghk-cu' || pep.id === 'melanotan-2' || pep.id === 'bpc-157')) {
        score += 35;
        matchedGoals.push('Dermal & Aesthetics');
      }

      if (selectedGoals.includes('stress_sleep') && (pep.id === 'selank' || pep.id === 'ipamorelin' || pep.id === 'sermorelin' || pep.id === 'oxytocin')) {
        score += 30;
        matchedGoals.push('Sleep & Stress Modulation');
      }

      if (selectedGoals.includes('libido') && (pep.id === 'pt-141' || pep.id === 'melanotan-2' || pep.id === 'oxytocin')) {
        score += 35;
        matchedGoals.push('Libido & Vitality');
      }

      // Filter/Adjust by Administration preference
      if (adminPreference === 'subq_weekly') {
        if (pep.halfLifeHours >= 72) score += 20; // GLP-1s, TB-500
        else score -= 10;
      } else if (adminPreference === 'subq_daily') {
        if (pep.halfLifeHours < 48) score += 15;
      } else if (adminPreference === 'nasal_topical') {
        if (pep.id === 'semax' || pep.id === 'selank' || pep.id === 'oxytocin' || pep.id === 'ghk-cu') {
          score += 25;
        }
      }

      // Adjust by experience level
      if (experienceLevel === 'beginner') {
        if (pep.id === 'bpc-157' || pep.id === 'tb-500' || pep.id === 'semax' || pep.id === 'ghk-cu' || pep.id === 'semaglutide') {
          score += 10;
        }
        if (pep.id === 'dihexa' || pep.id === 'retatrutide') {
          score -= 15; // More advanced compounds
        }
      }

      if (score > 20) {
        // Cap score at 98%
        const normalizedScore = Math.min(98, Math.max(45, score));
        
        let rationale = `Matches your selected research priorities with high target tissue specificity.`;
        if (pep.id === 'bpc-157') {
          rationale = `Gold standard for localized fibroblast recruitment, angiogenesis, and gut mucosa repair.`;
        } else if (pep.id === 'tirzepatide') {
          rationale = `Dual GIP/GLP-1 agonism delivers powerful metabolic rate regulation and adipose loss.`;
        } else if (pep.id === 'epithalon') {
          rationale = `Telomerase upregulation and pineal melatonin normalization for comprehensive biological age research.`;
        } else if (pep.id === 'ipamorelin') {
          rationale = `Selective somatotroph stimulation boosting Stage 4 deep sleep and connective tissue repair without cortisol.`;
        }

        const suggestedStack = CURATED_STACKS.find(s => s.peptides.some(p => p.peptideId === pep.id));

        scoredList.push({
          peptide: pep,
          score: normalizedScore,
          matchedGoals,
          rationale,
          suggestedProtocol: `${pep.standardDosing.typicalDose} ${pep.standardDosing.unit} • ${pep.standardDosing.frequency}`,
          suggestedStack
        });
      }
    });

    scoredList.sort((a, b) => b.score - a.score);
    setResults(scoredList);
  };

  const handleReset = () => {
    setSelectedGoals([]);
    setExperienceLevel('beginner');
    setAdminPreference('any');
    setStep(1);
    setResults(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Find Your Ideal Peptide</span>
          </div>
          <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest uppercase">
            Peptide Goal Matcher
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Answer a few simple questions about your goals (healing, fat loss, muscle, energy, focus) to find the best peptides and combos for you.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'quiz' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Goal Quiz
          </button>
          <button
            onClick={() => setActiveTab('stacks')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'stacks' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🧬 Popular Combos ({CURATED_STACKS.length})
          </button>
        </div>
      </div>

      {activeTab === 'stacks' ? (
        <CuratedStacks onAdoptStack={onAdoptStack} />
      ) : results ? (
        /* RESULTS VIEW */
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Found {results.length} Compatible Research Compounds</span>
              </h2>
              <p className="text-xs text-slate-400">
                Ranked by affinity with your research objectives and protocol criteria
              </p>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Matcher</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((res, idx) => (
              <div
                key={res.peptide.id}
                className="glass-panel p-6 rounded-3xl flex flex-col justify-between gap-4 border-slate-800 hover:border-cyan-500/40 transition shadow-xl relative overflow-hidden"
              >
                {/* Score Progress Ribbon */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Rank #{idx + 1} • {res.peptide.categoryLabel}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1.5">{res.peptide.name}</h3>
                  </div>

                  <div className="flex flex-col items-center bg-cyan-950/80 border border-cyan-500/40 px-3 py-1.5 rounded-2xl shadow-inner">
                    <span className="text-lg font-black text-cyan-400 font-mono">{res.score}%</span>
                    <span className="text-[9px] uppercase font-bold text-cyan-300/80">Match Score</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {res.rationale}
                </p>

                {/* Matched goals */}
                <div className="flex flex-wrap gap-1.5">
                  {res.matchedGoals.map((g, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                      ✓ {g}
                    </span>
                  ))}
                </div>

                {/* Suggested Protocol Box */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Suggested Routine</span>
                  <span className="font-semibold text-white">{res.suggestedProtocol}</span>
                  <span className="text-[11px] text-slate-400">{res.peptide.standardDosing.timing}</span>
                </div>

                {/* Synergistic Stack Pairing */}
                {res.suggestedStack && (
                  <div className="bg-purple-950/20 border border-purple-900/40 p-3 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-400 block">Recommended Combo Stack</span>
                      <span className="font-semibold text-purple-200">{res.suggestedStack.name}</span>
                    </div>
                    {onAdoptStack && (
                      <button
                        onClick={() => onAdoptStack(res.suggestedStack!)}
                        className="text-[11px] text-purple-300 hover:text-white font-bold underline"
                      >
                        View Stack
                      </button>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onOpenInCalculator(res.peptide)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Mix Calculator</span>
                  </button>

                  <button
                    onClick={() => onAddToProtocol(res.peptide)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 btn-glow-cyan hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Start Routine</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* MULTI-STEP QUIZ VIEW */
        <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6 max-w-3xl mx-auto shadow-2xl border-slate-800">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
            <span className="font-bold text-cyan-400 uppercase tracking-wider">
              Step {step} of 3
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step ? 'w-8 bg-cyan-400' : s < step ? 'w-4 bg-cyan-700' : 'w-4 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: OBJECTIVES */}
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <div>
                <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em]">Select Primary Research Objectives</h2>
                <p className="text-xs text-slate-400 mt-1">Choose all physiological pathways and targets you are investigating:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {GOALS_LIST.map(g => {
                  const isSelected = selectedGoals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-lg shadow-cyan-950/50 scale-[1.01]'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{g.icon}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-white' : 'border-slate-700'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="font-bold text-sm text-white mt-1">{g.label}</span>
                      <span className="text-[11px] text-slate-400 leading-snug">{g.description}</span>
                    </button>
                  );
                })}
              </div>

              <button
                disabled={selectedGoals.length === 0}
                onClick={() => setStep(2)}
                className="mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 btn-glow-cyan hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
              >
                <span>Continue to Protocol Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: EXPERIENCE & PREFERENCES */}
          {step === 2 && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em]">Experience Level & How You Take It</h2>
                <p className="text-xs text-slate-400 mt-1">Helps recommend simple single peptides or multi-peptide routines.</p>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Your Peptide Experience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'beginner', label: 'Beginner', desc: 'Well-known, simple to mix and take' },
                    { id: 'intermediate', label: 'Intermediate', desc: 'Popular combos & step-up schedules' },
                    { id: 'advanced', label: 'Advanced', desc: 'Multi-peptide blends & customized routines' }
                  ].map(exp => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setExperienceLevel(exp.id as any)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                        experienceLevel === exp.id
                          ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-md'
                          : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm text-white">{exp.label}</span>
                      <span className="text-[10px] text-slate-400">{exp.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Administration Frequency */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  How Often You Want to Take It
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'any', label: 'Any Frequency', desc: 'Show all matching peptides' },
                    { id: 'subq_weekly', label: 'Once a Week', desc: 'Weekly shots (e.g. Tirzepatide, Semaglutide)' },
                    { id: 'subq_daily', label: 'Daily', desc: 'Daily shots (e.g. BPC-157, CJC/Ipamorelin)' },
                    { id: 'nasal_topical', label: 'Nasal Spray or Skin Cream', desc: 'No needles (e.g. Semax, Selank, GHK-Cu)' }
                  ].map(adm => (
                    <button
                      key={adm.id}
                      type="button"
                      onClick={() => setAdminPreference(adm.id as any)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                        adminPreference === adm.id
                          ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-md'
                          : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm text-white">{adm.label}</span>
                      <span className="text-[10px] text-slate-400">{adm.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white font-semibold"
                >
                  ← Back to Goals
                </button>

                <button
                  onClick={() => {
                    setStep(3);
                    calculateMatches();
                  }}
                  className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 btn-glow-cyan hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
                >
                  <span>Show My Matches</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
