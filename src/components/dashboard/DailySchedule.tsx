import React, { useState, useMemo, useEffect } from 'react';
import { Protocol, DoseLogEntry } from '../../types';
import { db } from '../../db';
import { formatTiming, formatRelativeDate } from '../../utils/formatters';
import { LogAdminModal } from './LogAdminModal';
import { WeeklySummaryWidget } from './WeeklySummaryWidget';
import { VialStatusCard } from '../protocols/VialStatusCard';
import { ProtocolFormModal } from '../protocols/ProtocolFormModal';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  Shield, 
  Sparkles, 
  Activity, 
  ChevronRight, 
  AlertCircle,
  ThermometerSnowflake,
  Plus,
  Zap,
  Layers,
  CalendarCheck2
} from 'lucide-react';

interface DailyScheduleProps {
  protocols: Protocol[];
  logs: DoseLogEntry[];
  onLogSaved: () => void;
  onProtocolsChanged: () => void;
  onNavigateToCalculator?: () => void;
  logsCountMap?: Record<string, number>;
  initialProtocolData?: Partial<Protocol> | null;
  initialModalOpen?: boolean;
  onClearInitialProtocolData?: () => void;
}

export const DailySchedule: React.FC<DailyScheduleProps> = ({
  protocols,
  logs,
  onLogSaved,
  onProtocolsChanged,
  onNavigateToCalculator,
  logsCountMap = {},
  initialProtocolData = null,
  initialModalOpen = false,
  onClearInitialProtocolData,
}) => {
  // Dose Logging State
  const [selectedProtocolForLog, setSelectedProtocolForLog] = useState<Protocol | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // Routine / Protocol Management State
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState<boolean>(initialModalOpen);
  const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'paused'>('active');

  useEffect(() => {
    if (initialModalOpen || initialProtocolData !== null) {
      setIsProtocolModalOpen(true);
    }
  }, [initialModalOpen, initialProtocolData]);

  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const todayDateStr = today.toISOString().split('T')[0];

  const activeProtocols = useMemo(() => protocols.filter(p => p.isActive), [protocols]);
  const pausedProtocols = useMemo(() => protocols.filter(p => !p.isActive), [protocols]);

  // Protocols scheduled for today
  const scheduledToday = useMemo(() => {
    return activeProtocols.filter(p => {
      if (p.frequencyType === 'daily') return true;
      return p.daysOfWeek?.includes(todayDayOfWeek);
    });
  }, [activeProtocols, todayDayOfWeek]);

  // Check which scheduled protocols have already been logged today
  const loggedTodayProtocolIds = useMemo(() => {
    const ids = new Set<string>();
    logs.forEach(log => {
      if (log.timestamp.startsWith(todayDateStr)) {
        ids.add(log.protocolId);
      }
    });
    return ids;
  }, [logs, todayDateStr]);

  // Last used injection site from recent logs
  const lastUsedSiteName = logs.length > 0 ? logs[0].injectionSite : undefined;

  const handleOpenLog = (protocol: Protocol) => {
    setSelectedProtocolForLog(protocol);
    setIsLogModalOpen(true);
  };

  const handleOpenQuickDose = () => {
    const quickProto: Protocol = {
      id: `quick-${Date.now()}`,
      peptideId: 'custom-quick',
      peptideName: 'Ad-Hoc Dose',
      brandName: 'Immediate Administration',
      doseAmount: 250,
      doseUnit: 'mcg',
      vialMassMg: 5,
      bacWaterMl: 2.0,
      calculatedUnits: 10,
      concentrationMgMl: 2.5,
      syringeType: 'U-100',
      frequencyType: 'custom',
      daysOfWeek: [todayDayOfWeek],
      startDate: todayDateStr,
      plannedCycleWeeks: 4,
      timingOfDay: 'anytime',
      isActive: true
    };
    setSelectedProtocolForLog(quickProto);
    setIsLogModalOpen(true);
  };

  // Routine handlers
  const handleCreateNewRoutine = () => {
    setEditingProtocol(null);
    setIsProtocolModalOpen(true);
  };

  const handleEditRoutine = (protocol: Protocol) => {
    setEditingProtocol(protocol);
    setIsProtocolModalOpen(true);
  };

  const handleDeleteRoutine = async (protocolId: string) => {
    if (confirm('Are you sure you want to delete this routine? Your past dose history will still be kept.')) {
      await db.protocols.delete(protocolId);
      onProtocolsChanged();
    }
  };

  const handleToggleActiveRoutine = async (protocol: Protocol) => {
    await db.protocols.update(protocol.id, { isActive: !protocol.isActive });
    onProtocolsChanged();
  };

  const completedCount = scheduledToday.filter(p => loggedTodayProtocolIds.has(p.id)).length;
  const progressPercent = scheduledToday.length > 0 ? Math.round((completedCount / scheduledToday.length) * 100) : 0;

  // Calculate total weekly injections scheduled across active protocols
  const totalWeeklyInjections = activeProtocols.reduce((sum, p) => {
    if (p.frequencyType === 'daily') return sum + 7;
    return sum + (p.daysOfWeek?.length || 0);
  }, 0);

  const displayedProtocols = filterActive === 'all' 
    ? protocols 
    : filterActive === 'active' 
      ? activeProtocols 
      : pausedProtocols;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16">
      
      {/* Daily Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {/* High-Contrast Crisp Date Label */}
          <div className="flex items-center gap-2 text-slate-100 font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>
              {today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest">
            TODAY'S SCHEDULE & ROUTINES
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {scheduledToday.length === 0
              ? 'No doses scheduled for today. Track your active routines, log ad-hoc doses, or plan upcoming cycles below.'
              : `${scheduledToday.length} dose${scheduledToday.length > 1 ? 's' : ''} scheduled for today across your ${activeProtocols.length} active routine${activeProtocols.length > 1 ? 's' : ''}.`}
          </p>
        </div>

        {/* Action Buttons & Progress Meter */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleCreateNewRoutine}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Routine</span>
          </button>

          <button
            onClick={handleOpenQuickDose}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-emerald-300 hover:text-white font-bold text-xs transition active:scale-95 shadow-md cursor-pointer"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Log Quick Dose</span>
          </button>

          {scheduledToday.length > 0 && (
            <div className="glass-panel border-emerald-500/30 p-3.5 rounded-2xl flex items-center gap-3.5 shrink-0 shadow-lg">
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-500"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono font-bold text-[11px] text-white">
                  {progressPercent}%
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Today's Progress</span>
                <span className="text-xs font-extrabold text-white">
                  {completedCount} of {scheduledToday.length} Logged
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: TODAY'S SCHEDULED DOSES */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border-slate-800 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-[0.65rem] font-bold text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <ThermometerSnowflake className="w-4 h-4" />
            <span>Today's Scheduled Administrations</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {scheduledToday.length} Scheduled
          </span>
        </div>

        {scheduledToday.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {scheduledToday.map(protocol => {
              const isLogged = loggedTodayProtocolIds.has(protocol.id);
              return (
                <div
                  key={protocol.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col justify-between gap-4 ${
                    isLogged
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                      : 'bg-slate-900/80 border-slate-700/80 shadow-md hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-3 rounded-2xl border ${
                      isLogged 
                        ? 'bg-slate-900 border-slate-800 text-slate-500' 
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                      <ThermometerSnowflake className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-base leading-tight">
                          {protocol.peptideName}
                        </h3>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                          {protocol.doseAmount} {protocol.doseUnit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1 flex-wrap">
                        <span className="text-emerald-400 font-bold">{protocol.calculatedUnits} Units</span>
                        <span>•</span>
                        <span>{(protocol.calculatedUnits * 0.01).toFixed(2)} mL</span>
                        <span>•</span>
                        <span>{formatTiming(protocol.timingOfDay)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end border-t border-slate-800/60 pt-3">
                    {isLogged ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-800/80">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Logged Today</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenLog(protocol)}
                        className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Log Dose</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
            <span className="text-3xl">☕</span>
            <div>
              <p className="text-sm font-bold text-slate-100">No Doses Scheduled Today</p>
              <p className="text-xs text-slate-400 max-w-sm mt-0.5">
                {activeProtocols.length === 0
                  ? "You haven't set up any active routines yet. Click below to create your first routine."
                  : "Rest day! None of your active routines have administrations scheduled for today."}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
              <button
                onClick={handleCreateNewRoutine}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create a Routine</span>
              </button>

              <button
                onClick={handleOpenQuickDose}
                className="px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-emerald-300 hover:text-white font-bold rounded-2xl text-xs transition active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Log Quick Dose</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: WEEKLY TIMELINE & RECENT DOSE HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Adherence Summary (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col">
          <WeeklySummaryWidget
            protocols={protocols}
            logs={logs}
            onNavigateToProtocols={handleCreateNewRoutine}
          />
        </div>

        {/* Recent Dose Log Mini Timeline (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border-slate-800 shadow-xl h-full">
            <h3 className="text-[0.65rem] font-bold text-cyan-400 uppercase tracking-[0.2em] flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Recent Administrations</span>
              </div>
              <span className="text-xs font-mono text-slate-400">{logs.length} Total</span>
            </h3>

            {logs.length > 0 ? (
              <div className="flex flex-col gap-2.5 flex-1">
                {logs.slice(0, 4).map(log => (
                  <div
                    key={log.id}
                    className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{log.peptideName}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          ({log.doseAmount}{log.doseUnit})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Site: <span className="text-slate-300">{log.injectionSite || 'SubQ'}</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-500 font-mono">
                      {formatRelativeDate(log.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 flex-1 flex items-center justify-center">
                No doses logged yet.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 3: MY PEPTIDE ROUTINES & VIAL STATUS CARDS */}
      <div className="flex flex-col gap-6 pt-4 border-t border-slate-800/80">
        
        {/* Routines Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Dosing Plans & Active Vials</span>
            </div>
            <h2 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest">
              My Peptide Routines
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Set dosage, schedule injection days, and monitor reconstitution freshness and vial volume.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Stat Badges */}
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
                <span className="text-slate-400 font-medium">Active:</span>
                <span className="font-mono font-bold text-cyan-400">{activeProtocols.length}</span>
              </div>
              <div className="px-3.5 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
                <span className="text-slate-400 font-medium">Weekly Doses:</span>
                <span className="font-mono font-bold text-emerald-400">{totalWeeklyInjections}</span>
              </div>
            </div>

            <button
              onClick={handleCreateNewRoutine}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Routine</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setFilterActive('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterActive === 'active' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({activeProtocols.length})
            </button>
            <button
              onClick={() => setFilterActive('paused')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterActive === 'paused' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Paused ({pausedProtocols.length})
            </button>
            <button
              onClick={() => setFilterActive('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterActive === 'all' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({protocols.length})
            </button>
          </div>
        </div>

        {/* Protocols Grid */}
        {displayedProtocols.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProtocols.map(protocol => (
              <VialStatusCard
                key={protocol.id}
                protocol={protocol}
                onEdit={handleEditRoutine}
                onDelete={handleDeleteRoutine}
                onToggleActive={handleToggleActiveRoutine}
                onLogDose={(proto) => handleOpenLog(proto)}
                logsCount={logsCountMap[protocol.id] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
            <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-3xl">
              🧪
            </div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">No Routines Found</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              {filterActive === 'active'
                ? "You don't have any active routines yet. Create your first routine to start scheduling and tracking your doses."
                : 'No routines in this filter tab.'}
            </p>
            <button
              onClick={handleCreateNewRoutine}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-500/20 mt-2 cursor-pointer"
            >
              Create Your First Routine
            </button>
          </div>
        )}

      </div>

      {/* Routine Form Modal */}
      <ProtocolFormModal
        isOpen={isProtocolModalOpen}
        onClose={() => {
          setIsProtocolModalOpen(false);
          setEditingProtocol(null);
          onClearInitialProtocolData?.();
        }}
        onSaved={() => {
          onProtocolsChanged();
        }}
        editingProtocol={editingProtocol}
        initialData={initialProtocolData}
      />

      {/* Log Administration Modal */}
      <LogAdminModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setSelectedProtocolForLog(null);
        }}
        protocol={selectedProtocolForLog}
        onLogSaved={onLogSaved}
        lastUsedSiteName={lastUsedSiteName}
      />
    </div>
  );
};

