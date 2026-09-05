import React, { useState, useMemo } from 'react';
import { Protocol, DoseLogEntry } from '../../types';
import { formatTiming, formatRelativeDate } from '../../utils/formatters';
import { SiteRotationMap } from './SiteRotationMap';
import { LogAdminModal } from './LogAdminModal';
import { WeeklySummaryWidget } from './WeeklySummaryWidget';
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
  Zap
} from 'lucide-react';

interface DailyScheduleProps {
  protocols: Protocol[];
  logs: DoseLogEntry[];
  onLogSaved: (entry: DoseLogEntry) => void;
  onNavigateToProtocols: () => void;
  onNavigateToCalculator: () => void;
}

export const DailySchedule: React.FC<DailyScheduleProps> = ({
  protocols,
  logs,
  onLogSaved,
  onNavigateToProtocols,
  onNavigateToCalculator,
}) => {
  const [selectedProtocolForLog, setSelectedProtocolForLog] = useState<Protocol | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [selectedSiteName, setSelectedSiteName] = useState<string | undefined>(undefined);

  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const todayDateStr = today.toISOString().split('T')[0];

  const activeProtocols = useMemo(() => protocols.filter(p => p.isActive), [protocols]);

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

  const completedCount = scheduledToday.filter(p => loggedTodayProtocolIds.has(p.id)).length;
  const progressPercent = scheduledToday.length > 0 ? Math.round((completedCount / scheduledToday.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16">
      
      {/* Daily Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>
              {today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest">
            TODAY'S SCHEDULE
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {scheduledToday.length === 0
              ? 'No doses scheduled for today. Rest day in your routine!'
              : `${scheduledToday.length} dose${scheduledToday.length > 1 ? 's' : ''} scheduled for today across your active routines.`}
          </p>
        </div>

        {/* Action Button & Progress */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleOpenQuickDose}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-emerald-300 hover:text-white font-bold text-xs transition active:scale-95 shadow-md cursor-pointer"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Log Quick Dose</span>
          </button>

          {scheduledToday.length > 0 && (
            <div className="glass-panel border-emerald-500/30 p-3.5 rounded-2xl flex items-center gap-3.5 shrink-0 shadow-lg">
              <div className="relative w-12 h-12 flex items-center justify-center">
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
                <span className="absolute font-mono font-bold text-xs text-white">
                  {progressPercent}%
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Progress</span>
                <span className="text-sm font-extrabold text-white">
                  {completedCount} of {scheduledToday.length} Logged
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left 7 Columns (Schedule + Weekly Summary) / Right 5 Columns (Site Rotation Map & Recent History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Columns */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Today's Tasks Card */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-[0.65rem] font-bold text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span>Doses Ready For Administration</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {scheduledToday.length} Scheduled
              </span>
            </div>

            {scheduledToday.length > 0 ? (
              <div className="flex flex-col gap-3">
                {scheduledToday.map(protocol => {
                  const isLogged = loggedTodayProtocolIds.has(protocol.id);
                  return (
                    <div
                      key={protocol.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
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

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-white text-base leading-tight">
                              {protocol.peptideName}
                            </h3>
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                              {protocol.doseAmount} {protocol.doseUnit}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                            <span className="text-emerald-400 font-bold">{protocol.calculatedUnits} Units</span>
                            <span>•</span>
                            <span>{(protocol.calculatedUnits * 0.01).toFixed(2)} mL</span>
                            <span>•</span>
                            <span>{formatTiming(protocol.timingOfDay)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {isLogged ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-800/80">
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
                      ? "You haven't set up any active routines in your vault yet."
                      : "None of your active routines have scheduled administrations for today."}
                  </p>
                </div>

                {/* High Contrast Empty State Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
                  {activeProtocols.length === 0 ? (
                    <button
                      onClick={onNavigateToProtocols}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create a New Routine</span>
                    </button>
                  ) : (
                    <button
                      onClick={onNavigateToProtocols}
                      className="px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold rounded-2xl text-xs transition cursor-pointer"
                    >
                      View All Routines
                    </button>
                  )}

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

          {/* New Weekly Summary Widget */}
          <WeeklySummaryWidget
            protocols={protocols}
            logs={logs}
            onNavigateToProtocols={onNavigateToProtocols}
          />

        </div>

        {/* Right 5 Columns: Anatomical Site Rotation Map & Recent History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Site Rotation Map */}
          <SiteRotationMap
            lastUsedSiteName={lastUsedSiteName}
            selectedSiteName={selectedSiteName}
            onSelectSite={(site) => setSelectedSiteName(site)}
            interactive={true}
          />

          {/* Recent Administrations Mini Timeline */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border-slate-800 shadow-xl">
            <h3 className="text-[0.65rem] font-bold text-emerald-400 uppercase tracking-[0.2em] flex items-center justify-between border-b border-slate-800 pb-3">
              <span>Recent Doses Logged</span>
              <span className="text-xs font-normal text-slate-400">{logs.length} Total</span>
            </h3>

            {logs.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {logs.slice(0, 4).map(log => (
                  <div
                    key={log.id}
                    className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{log.peptideName}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          ({log.doseAmount}{log.doseUnit})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Site: <span className="text-slate-300">{log.injectionSite}</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-500 font-mono">
                      {formatRelativeDate(log.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No doses logged yet.
              </div>
            )}
          </div>
        </div>
      </div>

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
        initialSiteName={selectedSiteName}
      />
    </div>
  );
};
