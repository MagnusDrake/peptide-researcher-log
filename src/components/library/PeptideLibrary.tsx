import React, { useState, useEffect, useMemo } from 'react';
import { Peptide, PeptideCategory, CuratedStack } from '../../types';
import { PEPTIDES_DATABASE } from '../../data/peptides';
import { db } from '../../db';
import { PeptideCard } from './PeptideCard';
import { PeptideModal } from './PeptideModal';
import { PeptideCompare } from './PeptideCompare';
import { CustomPeptideModal } from './CustomPeptideModal';
import { PeptideMatcher } from '../matcher/PeptideMatcher';
import { Search, Plus, Sparkles, Scale, BookOpen, Layers } from 'lucide-react';

interface PeptideLibraryProps {
  onOpenInCalculator: (peptide: Peptide) => void;
  onAddToProtocol: (peptide: Peptide) => void;
  onAdoptStack?: (stack: CuratedStack, asSingleBlend?: boolean) => void;
  initialSubTab?: 'directory' | 'matcher';
}

export const PeptideLibrary: React.FC<PeptideLibraryProps> = ({
  onOpenInCalculator,
  onAddToProtocol,
  onAdoptStack,
  initialSubTab = 'directory',
}) => {
  const [guideSubTab, setGuideSubTab] = useState<'directory' | 'matcher'>(initialSubTab);
  const [isSubTransitioning, setIsSubTransitioning] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customPeptides, setCustomPeptides] = useState<Peptide[]>([]);
  const [activeModalPeptide, setActiveModalPeptide] = useState<Peptide | null>(null);
  const [comparedPeptideIds, setComparedPeptideIds] = useState<string[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  const handleSubTabChange = (newSubTab: 'directory' | 'matcher') => {
    if (newSubTab === guideSubTab) return;
    setIsSubTransitioning(true);
    setTimeout(() => {
      setGuideSubTab(newSubTab);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSubTransitioning(false);
        });
      });
    }, 400);
  };

  // Load custom peptides from IndexedDB
  useEffect(() => {
    async function loadCustom() {
      try {
        const stored = await db.customPeptides.toArray();
        setCustomPeptides(stored);
      } catch (e) {
        console.error('Error loading custom peptides:', e);
      }
    }
    loadCustom();
  }, []);

  const allPeptides: Peptide[] = useMemo(() => {
    return [...PEPTIDES_DATABASE, ...customPeptides];
  }, [customPeptides]);

  const filteredPeptides = useMemo(() => {
    return allPeptides.filter(pep => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        !searchTerm.trim() ||
        pep.name.toLowerCase().includes(q) ||
        pep.aliases.some(a => a.toLowerCase().includes(q)) ||
        pep.researchIndications.some(i => i.toLowerCase().includes(q)) ||
        pep.summary.toLowerCase().includes(q) ||
        (pep.blendComponents && pep.blendComponents.some(c => c.name.toLowerCase().includes(q)));

      const matchesCategory = 
        selectedCategory === 'all' || 
        (selectedCategory === 'blends' ? Boolean(pep.isBlend) : pep.category === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [allPeptides, searchTerm, selectedCategory]);

  const comparedPeptides = useMemo(() => {
    return allPeptides.filter(p => comparedPeptideIds.includes(p.id));
  }, [allPeptides, comparedPeptideIds]);

  const handleToggleCompare = (peptide: Peptide) => {
    if (comparedPeptideIds.includes(peptide.id)) {
      setComparedPeptideIds(comparedPeptideIds.filter(id => id !== peptide.id));
    } else {
      if (comparedPeptideIds.length >= 3) {
        alert('You can compare up to 3 peptides side-by-side.');
        return;
      }
      setComparedPeptideIds([...comparedPeptideIds, peptide.id]);
    }
  };

  const categories = [
    { id: 'all', label: 'All Compounds', icon: '📋' },
    { id: 'blends', label: 'Research Blends', icon: '🧪' },
    { id: 'healing', label: 'Injury & Healing', icon: '🩹' },
    { id: 'metabolic', label: 'Fat Loss & Appetite (GLP-1)', icon: '🔥' },
    { id: 'gh_secretagogue', label: 'Muscle & Growth Hormone', icon: '⚡' },
    { id: 'longevity', label: 'Energy & Anti-Aging', icon: '🧬' },
    { id: 'nootropic', label: 'Brain & Focus', icon: '🧠' },
    { id: 'cosmetic', label: 'Skin, Hair & Glow', icon: '✨' },
    { id: 'immune', label: 'Immunity & Defense', icon: '🛡️' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Sub-Tabs Switcher */}
      <div className="w-full max-w-full flex items-center justify-start sm:justify-center overflow-x-auto pb-1 scrollbar-none">
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner shrink-0">
          <button
            onClick={() => handleSubTabChange('directory')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              guideSubTab === 'directory'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Peptide Directory</span>
          </button>

          <button
            onClick={() => handleSubTabChange('matcher')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              guideSubTab === 'matcher'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Goal Matcher & Stacks</span>
          </button>
        </div>
      </div>

      <div className={`transition-all duration-[400ms] ease-out ${isSubTransitioning ? 'opacity-0 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0'}`}>
        {guideSubTab === 'matcher' ? (
          <PeptideMatcher
            onOpenInCalculator={onOpenInCalculator}
            onAddToProtocol={onAddToProtocol}
            onAdoptStack={onAdoptStack}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Peptide Guide & Directory</span>
                </div>
                <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest">
                  Peptide Guide & Library
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  Browse 30+ single research compounds and multi-peptide blends (KLOW, GLOW, Wolverine, etc.), review mechanisms, pharmacokinetics, and reconstitution ratios.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCustomModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Add Your Own Peptide</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Comparison Section (if active) */}
            {comparedPeptides.length > 0 && (
              <PeptideCompare
                peptides={comparedPeptides}
                onRemove={(id) => setComparedPeptideIds(comparedPeptideIds.filter(cid => cid !== id))}
                onClear={() => setComparedPeptideIds([])}
                onSelectPeptide={(p) => setActiveModalPeptide(p)}
              />
            )}

            {/* Search & Category Tabs Filter Bar */}
            <div className="flex flex-col gap-4">
              {/* Search Input Bar */}
              <div className="relative w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by compound name (e.g. KLOW, BPC-157, CagriSema), constituent, indication, or alias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 font-bold'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header Count */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Showing <strong className="text-slate-200">{filteredPeptides.length}</strong> research compounds</span>
              {comparedPeptideIds.length > 0 && (
                <span className="text-cyan-400 font-semibold">
                  {comparedPeptideIds.length} of 3 selected for comparison
                </span>
              )}
            </div>

            {/* Grid of Peptide Cards */}
            {filteredPeptides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPeptides.map(pep => (
                  <PeptideCard
                    key={pep.id}
                    peptide={pep}
                    onSelect={(p) => setActiveModalPeptide(p)}
                    onCompareToggle={handleToggleCompare}
                    isCompared={comparedPeptideIds.includes(pep.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
                <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-3xl">
                  🔍
                </div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">No Peptides Found</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  No research peptides matched your search query "{searchTerm}". Try a different term or clear filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold transition mt-2 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Modal Detail Profile */}
            <PeptideModal
              peptide={activeModalPeptide}
              onClose={() => setActiveModalPeptide(null)}
              onOpenInCalculator={onOpenInCalculator}
              onAddToProtocol={onAddToProtocol}
            />

            {/* Custom Peptide Creation Modal */}
            <CustomPeptideModal
              isOpen={isCustomModalOpen}
              onClose={() => setIsCustomModalOpen(false)}
              onPeptideCreated={(newPep) => {
                setCustomPeptides(prev => [...prev, newPep]);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
