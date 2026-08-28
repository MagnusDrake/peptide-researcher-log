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
    { id: 'healing', label: 'Injury & Healing', icon: '🩹' },
    { id: 'metabolic', label: 'Fat Loss & Appetite (GLP-1)', icon: '🔥' },
    { id: 'gh_secretagogue', label: 'Muscle & Growth Hormone', icon: '⚡' },
    { id: 'longevity', label: 'Energy & Anti-Aging', icon: '🧬' },
    { id: 'nootropic', label: 'Brain & Focus', icon: '🧠' },
    { id: 'cosmetic', label: 'Skin, Hair & Glow', icon: '✨' },
    { id: 'immune', label: 'Immunity & Health', icon: '🛡️' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Peptide Guide & Directory</span>
          </div>
          <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest uppercase">
            Peptide Guide & Library
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Browse 35+ peptide profiles, see what they're used for, how long they stay in your body, and how to mix them.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
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
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">No Peptides Found</h3>
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
