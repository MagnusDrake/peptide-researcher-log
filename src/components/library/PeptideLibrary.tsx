import React, { useState, useEffect, useMemo } from 'react';
import { Peptide, PeptideCategory } from '../../types';
import { PEPTIDES_DATABASE } from '../../data/peptides';
import { db } from '../../db';
import { PeptideCard } from './PeptideCard';
import { PeptideModal } from './PeptideModal';
import { PeptideCompare } from './PeptideCompare';
import { CustomPeptideModal } from './CustomPeptideModal';
import { Search, Plus, Sparkles, Scale, BookOpen, Layers } from 'lucide-react';

interface PeptideLibraryProps {
  onOpenInCalculator: (peptide: Peptide) => void;
  onAddToProtocol: (peptide: Peptide) => void;
}

export const PeptideLibrary: React.FC<PeptideLibraryProps> = ({
  onOpenInCalculator,
  onAddToProtocol,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customPeptides, setCustomPeptides] = useState<Peptide[]>([]);
  const [activeModalPeptide, setActiveModalPeptide] = useState<Peptide | null>(null);
  const [comparedPeptideIds, setComparedPeptideIds] = useState<string[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

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
      const matchesSearch = 
        pep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pep.aliases.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
        pep.researchIndications.some(i => i.toLowerCase().includes(searchTerm.toLowerCase())) ||
        pep.summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || pep.category === selectedCategory;

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
    { id: 'all', label: 'All Peptides', icon: '🧪' },
    { id: 'healing', label: 'Tissue & Healing', icon: '🩹' },
    { id: 'metabolic', label: 'GLP-1 & Metabolic', icon: '🔥' },
    { id: 'gh_secretagogue', label: 'GH & Anabolism', icon: '⚡' },
    { id: 'longevity', label: 'Longevity & Energy', icon: '🧬' },
    { id: 'nootropic', label: 'Nootropic & Brain', icon: '🧠' },
    { id: 'cosmetic', label: 'Skin & Aesthetics', icon: '✨' },
    { id: 'immune', label: 'Immune Modulators', icon: '🛡️' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Research Directory & Compendium</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            Peptide Knowledge Base
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Explore 35+ evidence-based research profiles, pharmacokinetic half-lives, reconstitution guidelines, studied indications, and side-by-side comparisons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Custom Peptide</span>
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
            placeholder="Search by compound name (e.g. BPC-157, Tirzepatide), indication, mechanism, or alias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white"
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
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
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
        <span>Showing <strong className="text-slate-200">{filteredPeptides.length}</strong> research peptides</span>
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
          <h3 className="text-lg font-bold text-white">No Peptides Found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            No research peptides matched your search query "{searchTerm}". Try a different term or clear filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold transition mt-2"
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
  );
};
