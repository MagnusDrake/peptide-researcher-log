import React, { useState, useMemo } from 'react';
import { Protocol, DoseLogEntry } from '../../types';
import { formatTiming, formatRelativeDate } from '../../utils/formatters';
import { SiteRotationMap } from './SiteRotationMap';
import { PkDecayChart } from './PkDecayChart';
import { LogAdminModal } from './LogAdminModal';
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
  ThermometerSnowflake
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

  const completedCount = scheduledToday.filter(p => loggedTodayProtocolIds.has(p.id)).length;
  const progressPercent = scheduledToday.length > 0 ? Math.round((completedCount / scheduledToday.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16">
      {/* Daily Hero Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
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

        {/* Today's Progress Card */}
        {scheduledToday.length > 0 && (
          <div className="glass-panel border-cyan-500/20 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-500"
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
              <span className="text-base font-extrabold text-white">
                {completedCount} of {scheduledToday.length} Logged
              </span>
              <span className="text-[11px] text-slate-500 block">
                {completedCount === scheduledToday.length ? '🎉 All tasks complete!' : `${scheduledToday.length - completedCount} pending`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Scheduled Tasks vs Site Rotation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Today's Tasks & Actions */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Today's Doses</span>
              </h2>

              <button
                onClick={onNavigateToProtocols}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
              >
                <span>Manage Routines</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {scheduledToday.length > 0 ? (
              <div className="flex flex-col gap-3.5">
                {scheduledToday.map(protocol => {
                  const isLogged = loggedTodayProtocolIds.has(protocol.id);

                  return (
                    <div
                      key={protocol.id}
                      className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isLogged
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40 text-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isLogged ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
                        }`}>
                          {isLogged ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-100">{protocol.peptideName}</h3>
                            {protocol.isBlend && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                                🧪 Stack ({protocol.blendComponents?.length || 2} Peptides)
                              </span>
                            )}
                            {protocol.brandName && (
                              <span className="text-[10px] text-slate-400">({protocol.brandName})</span>
                            )}
                          </div>

                          {protocol.isBlend && protocol.blendComponents && (
                            <div className="text-[11px] text-purple-300 font-mono mt-0.5">
                              {protocol.blendComponents.map(c => `${c.peptideName} (${c.deliveredDose || c.targetDose}${c.deliveredUnit || c.doseUnit})`).join(' + ')}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span className="font-bold text-cyan-300 font-mono">
                              {protocol.calculatedUnits} units ({protocol.syringeType})
                            </span>
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
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95 flex items-center gap-1.5"
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
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
                <span className="text-3xl">☕</span>
                <p className="text-sm font-bold text-slate-200">No Doses Scheduled Today</p>
                <p className="text-xs text-slate-500 max-w-sm">
                  {activeProtocols.length === 0
                    ? "You haven't set up any active routines yet."
                    : "None of your active routines are scheduled for today."}
                </p>
                {activeProtocols.length === 0 && (
                  <button
                    onClick={onNavigateToProtocols}
                    className="mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-xs font-bold transition shadow-md shadow-cyan-500/20"
                  >
                    Create a New Routine
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pharmacokinetics Curve Simulator */}
          <PkDecayChart protocols={activeProtocols} />
        </div>

        {/* Right 5 Columns: Anatomical Site Rotation Map & Recent History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Site Rotation Map */}
          <SiteRotationMap
            lastUsedSiteName={lastUsedSiteName}
            interactive={false}
          />

          {/* Recent Administrations Mini Timeline */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border-slate-800 shadow-xl">
            <h3 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center justify-between border-b border-slate-800 pb-3">
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
                        <span className="text-[10px] text-cyan-400 font-mono">
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
      />
    </div>
  );
};
