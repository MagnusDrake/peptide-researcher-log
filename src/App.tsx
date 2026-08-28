import React, { useState, useEffect } from 'react';
import { Protocol, DoseLogEntry, Peptide, CuratedStack, SyringeType, BlendComponent } from './types';
import { db, initializeDatabase } from './db';
import { PEPTIDES_DATABASE } from './data/peptides';
import { calculateReconstitution, calculateMultiBlend } from './utils/calculations';
import { parseDoseString } from './utils/formatters';
import { Navbar, NavTab } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { LockScreen } from './components/auth/LockScreen';
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
import { ProfileSettings } from './components/profile/ProfileSettings';
import { Calculator, Layers, TrendingUp, ArrowRightLeft, Sparkles, Plus, Calendar, Activity } from 'lucide-react';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('aura_unlocked') === 'true';
  });
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [calcSubTab, setCalcSubTab] = useState<'recon' | 'blend' | 'titration' | 'convert'>('recon');
  const [myPeptidesSubTab, setMyPeptidesSubTab] = useState<'schedule' | 'protocols' | 'journal'>('schedule');

  const handleTabChange = (newTab: NavTab) => {
    if (newTab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      // Let React render the new tab, then fade it in on the next tick
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      });
    }, 400); // 400ms out-transition
  };

  const handleUnlock = () => {
    sessionStorage.setItem('aura_unlocked', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aura_unlocked');
    setIsAuthenticated(false);
  };

  // Database state
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [logs, setLogs] = useState<DoseLogEntry[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState<boolean>(false);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });


  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#fcfbf9');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#090d16');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Pre-filled data for cross-tab workflows
  const [selectedPeptideForCalc, setSelectedPeptideForCalc] = useState<string>('bpc-157');
  const [initialProtocolData, setInitialProtocolData] = useState<Partial<Protocol> | null>(null);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState<boolean>(false);

  // Load database data
  const refreshData = async () => {
    try {
      await initializeDatabase();
      const allProtocols = await db.protocols.toArray();
      const allLogs = await db.doseLogs.orderBy('timestamp').reverse().toArray();
      setProtocols(allProtocols);
      setLogs(allLogs);
    } catch (err) {
      console.error('Database load error:', err);
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
    handleTabChange('calculator');
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
    setMyPeptidesSubTab('protocols'); handleTabChange('dashboard');
  };

  const handleSaveCalcAsProtocol = (data: Partial<Protocol>) => {
    setInitialProtocolData(data);
    setMyPeptidesSubTab('protocols'); handleTabChange('dashboard');
  };

  const handleAdoptStack = async (stack: CuratedStack, asSingleBlend: boolean = true) => {
    if (asSingleBlend) {
      // Build constituent blend components with exact dosing
      const blendComponents: BlendComponent[] = stack.peptides.map((item, idx) => {
        const pep = PEPTIDES_DATABASE.find(p => p.id === item.peptideId);
        const { doseAmount: parsedDose, doseUnit: parsedUnit } = parseDoseString(
          item.typicalDose, 
          pep?.standardDosing.typicalDose || 250
        );
        const defaultMg = pep?.commonVialSizesMg[0] || (parsedUnit === 'mg' ? 10 : 5);
        return {
          id: `c-blend-${idx}-${Date.now()}`,
          peptideName: item.peptideName,
          vialMassMg: defaultMg,
          targetDose: parsedDose,
          doseUnit: parsedUnit
        };
      });

      // Calculate complete multi-compound blend reconstitution
      const blendCalc = calculateMultiBlend({
        components: blendComponents.map(c => ({
          id: c.id,
          peptideName: c.peptideName,
          vialMassMg: c.vialMassMg,
          targetDose: c.targetDose,
          doseUnit: c.doseUnit
        })),
        bacWaterMl: 2.0,
        primaryComponentId: blendComponents[0].id,
        targetPrimaryDose: blendComponents[0].targetDose,
        primaryDoseUnit: blendComponents[0].doseUnit,
        syringeType: 'U-100'
      });

      const protocol: Protocol = {
        id: `proto-stack-${stack.id}-${Date.now()}`,
        peptideId: 'custom-blend',
        peptideName: stack.name,
        customPeptide: true,
        isBlend: true,
        blendComponents: blendCalc.components.map(c => ({
          id: c.id,
          peptideName: c.peptideName,
          vialMassMg: c.vialMassMg,
          targetDose: c.targetDose,
          doseUnit: c.doseUnit,
          deliveredDose: c.deliveredDoseMcg >= 1000 ? Number((c.deliveredDoseMcg / 1000).toFixed(2)) : Number(c.deliveredDoseMcg.toFixed(1)),
          deliveredUnit: c.deliveredDoseMcg >= 1000 ? 'mg' : 'mcg'
        })),
        brandName: `${stack.name} Formulation`,
        vialMassMg: blendCalc.totalVialMassMg,
        bacWaterMl: 2.0,
        doseAmount: blendComponents[0].targetDose,
        doseUnit: blendComponents[0].doseUnit,
        syringeType: 'U-100',
        calculatedUnits: blendCalc.drawUnits,
        concentrationMgMl: blendCalc.totalVialMassMg / 2.0,
        frequencyType: 'days_of_week',
        daysOfWeek: [1, 2, 3, 4, 5],
        timingOfDay: 'fasted_morning',
        startDate: new Date().toISOString().split('T')[0],
        reconstitutedDate: new Date().toISOString().split('T')[0],
        plannedCycleWeeks: 8,
        notes: `Adopted from ${stack.name}. Single-vial multi-peptide stack formulation.`,
        isActive: true,
        remainingVialUnits: 200,
        isPublic: false
      };

      await db.protocols.put(protocol);
      await refreshData();
      setMyPeptidesSubTab('protocols');
      handleTabChange('dashboard');
    } else {
      // Add each compound as an individual protocol with accurate reconstitution math
      for (const item of stack.peptides) {
        const pep = PEPTIDES_DATABASE.find(p => p.id === item.peptideId);
        const { doseAmount: parsedDose, doseUnit: parsedUnit } = parseDoseString(
          item.typicalDose, 
          pep?.standardDosing.typicalDose || 250
        );
        const vialMassMg = pep?.commonVialSizesMg[0] || (parsedUnit === 'mg' ? 10 : 5);
        const bacWaterMl = pep?.typicalBacWaterMl[0] || 2.0;

        const calc = calculateReconstitution({
          vialMassMg,
          bacWaterMl,
          targetDose: parsedDose,
          doseUnit: parsedUnit,
          syringeType: 'U-100'
        });

        const protocol: Protocol = {
          id: `proto-${item.peptideId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          peptideId: item.peptideId,
          peptideName: item.peptideName,
          brandName: `${stack.name} Protocol`,
          vialMassMg,
          bacWaterMl,
          doseAmount: parsedDose,
          doseUnit: parsedUnit,
          syringeType: 'U-100',
          calculatedUnits: calc.drawUnits,
          concentrationMgMl: calc.concentrationMgMl,
          frequencyType: item.frequency.toLowerCase().includes('daily') ? 'daily' : 'days_of_week',
          daysOfWeek: [1, 3, 5],
          timingOfDay: item.timing.toLowerCase().includes('morning') ? 'fasted_morning' : 'bedtime',
          startDate: new Date().toISOString().split('T')[0],
          reconstitutedDate: new Date().toISOString().split('T')[0],
          plannedCycleWeeks: 8,
          notes: `Adopted from ${stack.name}. Synergy: ${item.synergyReason}`,
          isActive: true,
          remainingVialUnits: Math.round(bacWaterMl * 100),
          isPublic: false
        };

        await db.protocols.put(protocol);
      }

      await refreshData();
      setMyPeptidesSubTab('protocols');
      handleTabChange('dashboard');
    }
  };

  // Build log counts map for protocols
  const logsCountMap = logs.reduce((acc, log) => {
    acc[log.protocolId] = (acc[log.protocolId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {!isAuthenticated && <LockScreen onUnlock={handleUnlock} />}
      <div className={`min-h-screen flex flex-col text-slate-100 selection:bg-cyan-500 selection:text-white transition-opacity duration-1000 ${!isAuthenticated ? 'opacity-0 overflow-hidden' : 'opacity-100'}`}>
        {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeProtocolsCount={protocols.filter(p => p.isActive).length}
        onInstallClick={handleInstallPwa}
        canInstall={canInstall}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className={`flex-1 px-4 lg:px-8 pt-6 pb-20 md:pb-12 w-full min-w-0 max-w-full overflow-x-hidden transition-all duration-[400ms] ease-out ${isTransitioning ? 'opacity-0 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0'}`}>
        {/* TAB 1: MY PEPTIDES (Merged Dashboard, Protocols, Journal) */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full min-w-0">
            {/* Sub-Tabs Switcher */}
            <div className="w-full max-w-full flex items-center justify-start sm:justify-center overflow-x-auto pb-1 scrollbar-none">
              <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner shrink-0">
                <button
                  onClick={() => setMyPeptidesSubTab('schedule')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    myPeptidesSubTab === 'schedule'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Today's Schedule</span>
                </button>

                <button
                  onClick={() => setMyPeptidesSubTab('protocols')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    myPeptidesSubTab === 'protocols'
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>My Routines</span>
                </button>

                <button
                  onClick={() => setMyPeptidesSubTab('journal')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    myPeptidesSubTab === 'journal'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Dose Log & History</span>
                </button>
              </div>
            </div>

            {myPeptidesSubTab === 'schedule' && (
              <DailySchedule
                protocols={protocols}
                logs={logs}
                onLogSaved={refreshData}
                onNavigateToProtocols={() => setMyPeptidesSubTab('protocols')}
                onNavigateToCalculator={() => handleTabChange('calculator')}
              />
            )}
            
            {myPeptidesSubTab === 'protocols' && (
              <ProtocolManager
                protocols={protocols}
                onProtocolsChanged={refreshData}
                onLogDose={(proto) => {
                  setMyPeptidesSubTab('schedule');
                }}
                logsCountMap={logsCountMap}
                initialProtocolData={initialProtocolData}
                initialModalOpen={initialProtocolData !== null}
              />
            )}

            {myPeptidesSubTab === 'journal' && (
              <ResearchJournal
                logs={logs}
                protocols={protocols}
                onLogsChanged={refreshData}
              />
            )}
          </div>
        )}

        {/* TAB 2: CALCULATOR & SYRINGE TOOLS */}
        {activeTab === 'calculator' && (
          <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full min-w-0">
            {/* Calculator Sub-Tabs Switcher (Horizontal scroll on mobile) */}
            <div className="w-full max-w-full flex items-center justify-start sm:justify-center overflow-x-auto pb-1 scrollbar-none">
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
                  <span>Mixing & Syringe Guide</span>
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
                  <span>🧪 Multi-Peptide Mix</span>
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
                  <span>GLP-1 Dose Ramp-Up</span>
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
                  <span>Unit Converter</span>
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

        {/* TAB 4: GOAL MATCHER & CURATED STACKS */}
        {activeTab === 'matcher' && (
          <PeptideMatcher
            onOpenInCalculator={handleOpenInCalculator}
            onAddToProtocol={handleAddToProtocol}
            onAdoptStack={handleAdoptStack}
          />
        )}

        {/* TAB 7: PEER RESEARCHER COMMUNITY HUB */}
        {activeTab === 'community' && (
          <CommunityHub
            protocols={protocols}
            logs={logs}
            onAdoptProtocol={(proto) => {
              setInitialProtocolData(proto);
              setMyPeptidesSubTab('protocols');
              handleTabChange('dashboard');
            }}
          />
        )}

        {/* TAB 8: VAULT PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <ProfileSettings onLogout={handleLogout} />
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeProtocolsCount={protocols.filter(p => p.isActive).length}
      />
    </div>
    </>
  );
}

export default App;


