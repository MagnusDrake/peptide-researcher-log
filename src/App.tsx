import React, { useState, useEffect } from 'react';
import { Protocol, DoseLogEntry, Peptide, CuratedStack, SyringeType } from './types';
import { db, initializeDatabase } from './db';
import { Navbar, NavTab } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { DailySchedule } from './components/dashboard/DailySchedule';
import { ReconstitutionCalc } from './components/calculator/ReconstitutionCalc';
import { BlendCalculator } from './components/calculator/BlendCalculator';
import { TitrationPlanner } from './components/calculator/TitrationPlanner';
import { UnitConverter } from './components/calculator/UnitConverter';
import { PeptideLibrary } from './components/library/PeptideLibrary';
import { PeptideMatcher } from './components/matcher/PeptideMatcher';
import { ProtocolManager } from './components/protocols/ProtocolManager';
import { ResearchJournal } from './components/journal/ResearchJournal';
import { CommunityHub } from './components/community/CommunityHub';
import { Calculator, Layers, TrendingUp, ArrowRightLeft, Sparkles, Plus } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [calcSubTab, setCalcSubTab] = useState<'recon' | 'blend' | 'titration' | 'convert'>('recon');

  // Database state
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [logs, setLogs] = useState<DoseLogEntry[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState<boolean>(false);

  // Pre-filled data for cross-tab workflows
  const [selectedPeptideForCalc, setSelectedPeptideForCalc] = useState<string>('bpc-157');
  const [initialProtocolData, setInitialProtocolData] = useState<Partial<Protocol> | null>(null);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState<boolean>(false);

  // Load database data
  const refreshData = async () => {
    try {
      await initializeDatabase();
      const loadedProtocols = await db.protocols.toArray();
      const loadedLogs = await db.doseLogs.orderBy('timestamp').reverse().toArray();
      setProtocols(loadedProtocols);
      setLogs(loadedLogs);
    } catch (e) {
      console.error('Database load error:', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  useEffect(() => {
    // PWA Install prompt listener
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
    setDeferredPrompt(null);
  };

  // Cross-component handlers
  const handleOpenInCalculator = (peptide: Peptide) => {
    setSelectedPeptideForCalc(peptide.id);
    setCalcSubTab('recon');
    setActiveTab('calculator');
  };

  const handleAddToProtocol = (peptide: Peptide) => {
    setInitialProtocolData({
      peptideId: peptide.id,
      peptideName: peptide.name,
      doseAmount: peptide.standardDosing.typicalDose,
      doseUnit: peptide.standardDosing.unit,
      vialMassMg: peptide.commonVialSizesMg[0] || 5,
      bacWaterMl: peptide.typicalBacWaterMl[0] || 2.0,
      syringeType: 'U-100'
    });
    setActiveTab('protocols');
  };

  const handleSaveCalcAsProtocol = (data: Partial<Protocol>) => {
    setInitialProtocolData(data);
    setActiveTab('protocols');
  };

  const handleAdoptStack = async (stack: CuratedStack) => {
    // Add all peptides in the stack as active protocols
    for (const item of stack.peptides) {
      const id = `proto-${item.peptideId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const doseNum = parseFloat(item.typicalDose.replace(/[^0-9.]/g, '')) || 250;
      const isMg = item.typicalDose.toLowerCase().includes('mg');

      const protocol: Protocol = {
        id,
        peptideId: item.peptideId,
        peptideName: item.peptideName,
        brandName: `${stack.name} Formulation`,
        vialMassMg: isMg ? 10 : 5,
        bacWaterMl: 2.0,
        doseAmount: doseNum,
        doseUnit: isMg ? 'mg' : 'mcg',
        syringeType: 'U-100',
        calculatedUnits: isMg ? (doseNum / 5) * 100 : (doseNum / 25),
        concentrationMgMl: isMg ? 5 : 2.5,
        frequencyType: item.frequency.toLowerCase().includes('daily') ? 'daily' : 'days_of_week',
        daysOfWeek: [1, 3, 5],
        timingOfDay: item.timing.toLowerCase().includes('morning') ? 'fasted_morning' : 'bedtime',
        startDate: new Date().toISOString().split('T')[0],
        plannedCycleWeeks: 8,
        notes: `Adopted from ${stack.name}. Synergy: ${item.synergyReason}`,
        isActive: true,
        reconstitutedDate: new Date().toISOString().split('T')[0],
        remainingVialUnits: 100,
        isPublic: false
      };

      await db.protocols.put(protocol);
    }

    await refreshData();
    setActiveTab('protocols');
    alert(`Successfully added all ${stack.peptides.length} compounds from "${stack.name}" to your active protocols!`);
  };

  // Build log counts map for protocols
  const logsCountMap = logs.reduce((acc, log) => {
    acc[log.protocolId] = (acc[log.protocolId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeProtocolsCount={protocols.filter(p => p.isActive).length}
        onInstallClick={handleInstallPwa}
        canInstall={canInstall}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 lg:px-8 pt-6 pb-20 md:pb-12">
        {/* TAB 1: DAILY DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DailySchedule
            protocols={protocols}
            logs={logs}
            onLogSaved={refreshData}
            onNavigateToProtocols={() => setActiveTab('protocols')}
            onNavigateToCalculator={() => setActiveTab('calculator')}
          />
        )}

        {/* TAB 2: CALCULATOR & SYRINGE TOOLS */}
        {activeTab === 'calculator' && (
          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {/* Calculator Sub-Tabs Switcher (Horizontal scroll on mobile) */}
            <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto pb-1 scrollbar-none">
              <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner shrink-0">
                <button
                  onClick={() => setCalcSubTab('recon')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    calcSubTab === 'recon'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calculator className="w-4 h-4 shrink-0" />
                  <span>Reconstitution & Syringe</span>
                </button>

                <button
                  onClick={() => setCalcSubTab('blend')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    calcSubTab === 'blend'
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>🧪 Stack & Blend (2, 3, 4+)</span>
                </button>

                <button
                  onClick={() => setCalcSubTab('titration')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    calcSubTab === 'titration'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>GLP-1 Titration</span>
                </button>

                <button
                  onClick={() => setCalcSubTab('convert')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    calcSubTab === 'convert'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4 shrink-0" />
                  <span>Converter</span>
                </button>
              </div>
            </div>

            {/* Sub-tab view */}
            {calcSubTab === 'recon' && (
              <ReconstitutionCalc
                initialPeptideId={selectedPeptideForCalc}
                onSaveAsProtocol={handleSaveCalcAsProtocol}
              />
            )}
            {calcSubTab === 'blend' && (
              <BlendCalculator onSaveAsProtocol={handleSaveCalcAsProtocol} />
            )}
            {calcSubTab === 'titration' && <TitrationPlanner />}
            {calcSubTab === 'convert' && <UnitConverter />}
          </div>
        )}

        {/* TAB 3: PEPTIDE KNOWLEDGE BASE */}
        {activeTab === 'library' && (
          <PeptideLibrary
            onOpenInCalculator={handleOpenInCalculator}
            onAddToProtocol={handleAddToProtocol}
          />
        )}

        {/* TAB 4: GOAL MATCHER & CURATED STACKS (inspired by MyPeptideMatch) */}
        {activeTab === 'matcher' && (
          <PeptideMatcher
            onOpenInCalculator={handleOpenInCalculator}
            onAddToProtocol={handleAddToProtocol}
            onAdoptStack={handleAdoptStack}
          />
        )}

        {/* TAB 5: PROTOCOLS & STACKS */}
        {activeTab === 'protocols' && (
          <ProtocolManager
            protocols={protocols}
            onProtocolsChanged={refreshData}
            onLogDose={(proto) => {
              setActiveTab('dashboard');
            }}
            logsCountMap={logsCountMap}
            initialProtocolData={initialProtocolData}
            initialModalOpen={initialProtocolData !== null}
          />
        )}

        {/* TAB 6: JOURNAL & BIOMARKER TRENDS */}
        {activeTab === 'journal' && (
          <ResearchJournal
            logs={logs}
            protocols={protocols}
            onLogsChanged={refreshData}
          />
        )}

        {/* TAB 7: PEER RESEARCHER COMMUNITY HUB */}
        {activeTab === 'community' && (
          <CommunityHub
            protocols={protocols}
            logs={logs}
            onAdoptProtocol={(proto) => {
              setInitialProtocolData(proto);
              setActiveTab('protocols');
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeProtocolsCount={protocols.filter(p => p.isActive).length}
      />
    </div>
  );
}

export default App;
