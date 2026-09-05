import React from 'react';
import { Protocol, DoseLogEntry } from '../../types';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowRight
} from 'lucide-react';

interface WeeklySummaryWidgetProps {
  protocols: Protocol[];
  logs: DoseLogEntry[];
  onNavigateToProtocols?: () => void;
}

export const WeeklySummaryWidget: React.FC<WeeklySummaryWidgetProps> = ({
  protocols,
  logs,
  onNavigateToProtocols,
}) => {
  const activeProtocols = protocols.filter(p => p.isActive);

  // Generate current week days (Monday - Sunday)
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  
  // Calculate Monday of current week
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const weekDays = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = dateStr === today.toISOString().split('T')[0];
    const dayIndex = d.getDay(); // 0=Sun, 1=Mon...

    // Protocols scheduled on this day
    const scheduled = activeProtocols.filter(p => {
      if (p.frequencyType === 'daily') return true;
      return p.daysOfWeek?.includes(dayIndex);
    });

    // Logs completed on this day
    const logsOnDay = logs.filter(l => l.timestamp.startsWith(dateStr));
    const isCompleted = scheduled.length > 0 && logsOnDay.length >= scheduled.length;
    const isPartiallyCompleted = scheduled.length > 0 && logsOnDay.length > 0 && logsOnDay.length < scheduled.length;
    const isPast = d < new Date(today.setHours(0, 0, 0, 0));

    return {
      date: d,
      dateStr,
      dayAbbr: d.toLocaleDateString(undefined, { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday,
      scheduledCount: scheduled.length,
      loggedCount: logsOnDay.length,
      isCompleted,
      isPartiallyCompleted,
      isPast,
      isRestDay: scheduled.length === 0
    };
  });

  const totalWeeklyScheduled = weekDays.reduce((acc, d) => acc + d.scheduledCount, 0);
  const totalWeeklyCompleted = weekDays.reduce((acc, d) => acc + d.loggedCount, 0);
  const adherencePercent = totalWeeklyScheduled > 0 
    ? Math.min(100, Math.round((totalWeeklyCompleted / totalWeeklyScheduled) * 100)) 
    : 100;

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 shadow-xl flex flex-col gap-5">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Weekly Routine & Adherence Summary</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              7-day schedule breakdown and cycle continuity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono flex items-center gap-1.5">
            <span className="text-slate-400">Adherence:</span>
            <span className={`font-bold ${adherencePercent >= 80 ? 'text-emerald-400' : 'text-cyan-300'}`}>
              {adherencePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Minimalist Adherence Calendar Grid */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Weekly Timeline
        </span>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map(day => (
            <div
              key={day.dateStr}
              className={`p-2 sm:p-3 rounded-2xl border text-center flex flex-col items-center justify-between gap-1 transition ${
                day.isToday
                  ? 'bg-cyan-500 text-white border-cyan-300 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300/60 scale-[1.03]'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider font-bold ${
                day.isToday ? 'text-white drop-shadow-sm' : 'text-slate-400'
              }`}>
                {day.dayAbbr}
              </span>

              <span className={`text-xs sm:text-sm font-mono ${
                day.isToday ? 'text-white font-black drop-shadow-sm text-sm sm:text-base' : 'text-slate-300 font-bold'
              }`}>
                {day.dayNumber}
              </span>

              {/* Status Indicator Dot */}
              <div className="mt-1">
                {day.isCompleted ? (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    day.isToday ? 'bg-white/25 text-white' : 'bg-emerald-500/20 text-emerald-400'
                  }`} title="Dose Completed">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : day.isPartiallyCompleted ? (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    day.isToday ? 'bg-white/25 text-white' : 'bg-amber-500/20 text-amber-400'
                  }`} title="Partially Logged">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                ) : day.scheduledCount > 0 ? (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    day.isToday ? 'bg-white/30 text-white' : day.isPast ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/10 text-cyan-400'
                  }`} title={day.isPast ? 'Missed Dose' : `${day.scheduledCount} Scheduled`}>
                    <span className={`w-2 h-2 rounded-full ${day.isToday ? 'bg-white' : 'bg-current'}`}></span>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" title="Rest Day">
                    <span className={`w-1.5 h-1.5 rounded-full ${day.isToday ? 'bg-white/40' : 'bg-slate-700'}`}></span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Compounds Roster */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Active Compounds in Stack ({activeProtocols.length})
          </span>
          {onNavigateToProtocols && (
            <button
              onClick={onNavigateToProtocols}
              className="text-[11px] font-bold text-cyan-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
            >
              <span>Manage Routines</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {activeProtocols.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeProtocols.map(proto => (
              <div
                key={proto.id}
                className="bg-slate-950/70 border border-slate-800/90 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white font-bold block">{proto.peptideName}</strong>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {proto.doseAmount}{proto.doseUnit} • {proto.calculatedUnits} units
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-emerald-400 border border-emerald-500/20 uppercase">
                  {proto.frequencyType === 'daily' ? 'Daily' : 'Weekly Scheduled'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-center text-xs text-slate-400 leading-relaxed">
            No active peptide protocols registered in this vault. Create a new routine or log an ad-hoc dose above to begin tracking.
          </div>
        )}
      </div>

    </div>
  );
};
