import React, { useState, useMemo } from 'react';
import { DoseLogEntry, Protocol } from '../../types';
import { db } from '../../db';
import { exportLogsToCsv, exportDatabaseToJson, triggerDownload, importDatabaseFromJson } from '../../utils/exportImport';
import { PkDecayChart } from '../dashboard/PkDecayChart';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  BookOpen, 
  Download, 
  Upload, 
  Trash2, 
  Filter, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Sparkles,
  FileSpreadsheet,
  Database,
  Utensils,
  Scale
} from 'lucide-react';

interface ResearchJournalProps {
  logs: DoseLogEntry[];
  protocols: Protocol[];
  onLogsChanged: () => void;
}

export const ResearchJournal: React.FC<ResearchJournalProps> = ({
  logs,
  protocols,
  onLogsChanged,
}) => {
  const [selectedPeptideFilter, setSelectedPeptideFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'timeline' | 'trends' | 'backup'>('timeline');

  const peptideNames = useMemo(() => {
    const names = new Set<string>();
    logs.forEach(l => names.add(l.peptideName));
    return Array.from(names);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (selectedPeptideFilter === 'all') return logs;
    return logs.filter(l => l.peptideName === selectedPeptideFilter);
  }, [logs, selectedPeptideFilter]);

  const handleDeleteLog = async (logId: string) => {
    if (confirm('Delete this research administration record?')) {
      await db.doseLogs.delete(logId);
      onLogsChanged();
    }
  };

  const handleExportCsv = async () => {
    const csv = await exportLogsToCsv();
    if (!csv) {
      alert('No logs available to export.');
      return;
    }
    triggerDownload(csv, `peptide_research_logs_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const handleExportJson = async () => {
    const json = await exportDatabaseToJson();
    triggerDownload(json, `peptide_research_backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = await importDatabaseFromJson(content);
        alert(res.message);
        if (res.success) onLogsChanged();
      }
    };
    reader.readAsText(file);
  };

  // Prepare trend data for charts (Chronological order)
  const trendData = useMemo(() => {
    const sorted = [...filteredLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return sorted.map(l => {
      const date = new Date(l.timestamp);
      return {
        dateLabel: `${date.getMonth() + 1}/${date.getDate()}`,
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        peptide: l.peptideName,
        recovery: l.subjectiveMetrics?.recoveryScore ?? null,
        energy: l.subjectiveMetrics?.energyLevel ?? null,
        sleep: l.subjectiveMetrics?.sleepQuality ?? null,
        hairSkinNails: l.subjectiveMetrics?.hairSkinNailsQuality ?? null,
        foodHabit: l.subjectiveMetrics?.foodHabit ?? null,
        pain: l.subjectiveMetrics?.symptomPainScore ?? null,
        weight: l.subjectiveMetrics?.bodyWeightLbs ?? null,
      };
    });
  }, [filteredLogs]);

  // Dedicated chronological Body Weight trend data & summary stats
  const weightTrendData = useMemo(() => {
    const withWeight = filteredLogs
      .filter(l => l.subjectiveMetrics?.bodyWeightLbs !== undefined && Number(l.subjectiveMetrics.bodyWeightLbs) > 0)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return withWeight.map(l => {
      const date = new Date(l.timestamp);
      return {
        timestamp: l.timestamp,
        dateLabel: `${date.getMonth() + 1}/${date.getDate()}`,
        fullDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        peptide: l.peptideName,
        weight: Number(l.subjectiveMetrics!.bodyWeightLbs),
        notes: l.notes || '',
      };
    });
  }, [filteredLogs]);

  const weightStats = useMemo(() => {
    if (weightTrendData.length === 0) return null;
    const weights = weightTrendData.map(d => d.weight);
    const start = weights[0];
    const current = weights[weights.length - 1];
    const delta = Number((current - start).toFixed(1));
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    return { start, current, delta, min, max, count: weights.length };
  }, [weightTrendData]);


  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Dose History & Results</span>
          </div>
          <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest uppercase">
            Dose Log & Progress Trends
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Review your past doses, track how you feel over time (energy, sleep, recovery), and download your records anytime.
          </p>
        </div>
      </div>

      {/* Navigation Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'timeline' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Dose History ({filteredLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'trends' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Progress Charts
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'backup' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            💾 Backup & Export
          </button>
        </div>

        {/* Filter by Compound */}
        {peptideNames.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedPeptideFilter}
              onChange={(e) => setSelectedPeptideFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:border-cyan-400 outline-none"
            >
              <option value="all">All Compounds ({logs.length})</option>
              {peptideNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: TIMELINE VIEW */}
      {activeTab === 'timeline' && (
        <div className="flex flex-col gap-4">
          {filteredLogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5">
              {filteredLogs.map(log => {
                const date = new Date(log.timestamp);
                const hasMetrics = log.subjectiveMetrics && Object.values(log.subjectiveMetrics).some(v => v !== undefined);

                return (
                  <div
                    key={log.id}
                    className="glass-panel p-5 rounded-2xl border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        💉
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-100">{log.peptideName}</h3>
                          {log.isBlend && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold border border-purple-800">
                              🧪 Multi-Stack
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
                            {log.doseAmount} {log.doseUnit} ({log.drawUnits} units)
                          </span>
                          <span className="text-xs text-slate-400">
                            • Site: <strong className="text-slate-200">{log.injectionSite}</strong>
                          </span>

                          {/* Subcutaneous Reaction Badge */}
                          {log.reactionRating && log.reactionRating !== 'none' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                              log.reactionRating === 'other'
                                ? 'bg-amber-950/70 text-amber-300 border-amber-800/80'
                                : 'bg-rose-950/70 text-rose-300 border-rose-800/80'
                            }`}>
                              ⚠️ Reaction: {log.reactionRating === 'other' 
                                ? (log.customReactionText || 'Other custom reaction') 
                                : log.reactionRating.replace('_', ' ')}
                            </span>
                          )}
                        </div>

                        {log.isBlend && log.blendDelivered && log.blendDelivered.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {log.blendDelivered.map((d, idx) => (
                              <span key={idx} className="text-[11px] px-2 py-0.5 bg-slate-900 text-purple-200 rounded-md border border-purple-900/50 font-mono">
                                <strong>{d.peptideName}:</strong> {d.doseAmount} {d.doseUnit}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-slate-400 font-mono">
                          {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>

                        {log.notes && (
                          <p className="text-xs text-slate-300 italic mt-1 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                            "{log.notes}"
                          </p>
                        )}

                        {/* Subjective metrics badges */}
                        {hasMetrics && log.subjectiveMetrics && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {log.subjectiveMetrics.recoveryScore !== undefined && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                                Recovery: {log.subjectiveMetrics.recoveryScore}/10
                              </span>
                            )}
                            {log.subjectiveMetrics.energyLevel !== undefined && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                                Energy: {log.subjectiveMetrics.energyLevel}/10
                              </span>
                            )}
                            {log.subjectiveMetrics.sleepQuality !== undefined && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/80">
                                Sleep: {log.subjectiveMetrics.sleepQuality}/10
                              </span>
                            )}
                            {log.subjectiveMetrics.hairSkinNailsQuality !== undefined && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-950 text-pink-300 border border-pink-800/80 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                Hair, Nails & Skin: {log.subjectiveMetrics.hairSkinNailsQuality}/10
                              </span>
                            )}
                            {log.subjectiveMetrics.foodHabit && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800/80 flex items-center gap-1">
                                <Utensils className="w-2.5 h-2.5" />
                                Food: {log.subjectiveMetrics.foodHabit}
                              </span>
                            )}
                            {log.subjectiveMetrics.bodyWeightLbs !== undefined && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800/80 font-mono">
                                Weight: {log.subjectiveMetrics.bodyWeightLbs} lbs
                              </span>
                            )}
                          </div>
                        )}

                        {/* Attached Photo */}
                        {log.photoDataUri && (
                          <div className="mt-3">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer group relative">
                              <img src={log.photoDataUri} alt="Progress Note" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">Attached</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-2 rounded-xl hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">📝</span>
              <h3 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em]">No Doses Logged Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Log your first dose from Today's Schedule to start seeing your history and charts here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BIOMARKER & BODY WEIGHT TREND CHARTS */}
      {activeTab === 'trends' && (
        <div className="flex flex-col gap-8">
          {/* 1. DEDICATED BODY WEIGHT PROGRESS CHART */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-6 border-slate-800 shadow-xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-400">
                    Physical Progress Telemetry
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <span>Body Weight Progress (lbs)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Track weight dynamics and trend patterns logged during your administrations
                </p>
              </div>

              {/* Summary Stats Badges */}
              {weightStats && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl flex flex-col">
                    <span className="text-[0.6rem] uppercase tracking-wider text-slate-400">Current</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">{weightStats.current} <span className="text-[0.65rem] font-normal text-slate-400">lbs</span></span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl flex flex-col">
                    <span className="text-[0.6rem] uppercase tracking-wider text-slate-400">Net Change</span>
                    <span className={`text-sm font-bold font-mono ${weightStats.delta > 0 ? 'text-cyan-400' : weightStats.delta < 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {weightStats.delta > 0 ? `+${weightStats.delta}` : weightStats.delta} <span className="text-[0.65rem] font-normal text-slate-400">lbs</span>
                    </span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl flex flex-col">
                    <span className="text-[0.6rem] uppercase tracking-wider text-slate-400">Range</span>
                    <span className="text-xs font-semibold text-slate-300 font-mono">{weightStats.min} - {weightStats.max}</span>
                  </div>
                </div>
              )}
            </div>

            {weightTrendData.length > 1 ? (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightTrendData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                    <XAxis 
                      dataKey="dateLabel" 
                      stroke="#64748b" 
                      fontSize={11} 
                      tickLine={false}
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 2']} 
                      stroke="#64748b" 
                      fontSize={11} 
                      tickLine={false}
                      unit=" lbs"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900/95 border border-amber-500/30 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs flex flex-col gap-1.5">
                              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5">
                                <span className="text-slate-400 text-[0.65rem] uppercase tracking-wider">{data.fullDate}</span>
                                <span className="text-slate-500 text-[0.65rem]">{data.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Scale className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-400 font-mono font-bold text-sm">{data.weight} lbs</span>
                              </div>
                              <span className="text-slate-300 text-[0.7rem]">
                                Compound: <span className="text-cyan-400 font-medium">{data.peptide}</span>
                              </span>
                              {data.notes && (
                                <span className="text-slate-400 text-[0.65rem] italic mt-0.5 max-w-[200px] truncate">
                                  "{data.notes}"
                                </span>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      name="Body Weight" 
                      stroke="#f59e0b" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#weightGradient)" 
                      dot={{ r: 4, fill: '#f59e0b', stroke: '#0f172a', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : weightTrendData.length === 1 ? (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100 flex items-center gap-2">
                    <span>Baseline Recorded: <span className="text-amber-400 font-mono">{weightTrendData[0].weight} lbs</span></span>
                    <span className="text-slate-400 font-normal">({weightTrendData[0].dateLabel})</span>
                  </div>
                  <p className="text-slate-400 text-[0.7rem] mt-0.5">
                    Log your body weight on your next dose to start rendering the full progress trend line and rate of change.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
                  <Scale className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">No Body Weight Entries Recorded</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  When logging an administration, enter your body weight in the biometric field to track and visualize physical composition changes over time.
                </p>
              </div>
            )}
          </div>

          {/* 2. SUBJECTIVE WELL-BEING & RECOVERY TREND CHART */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-6 border-slate-800 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Subjective Biometric Telemetry
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-100">
                How You're Feeling Over Time (Scores 1 - 10)
              </h3>
              <p className="text-xs text-slate-400">
                Energy, recovery, sleep quality, and hair/nails/skin ratings recorded with your doses
              </p>
            </div>

            {trendData.filter(d => d.recovery !== null || d.energy !== null || d.sleep !== null || d.hairSkinNails !== null).length > 1 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                    <XAxis dataKey="dateLabel" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-2xl shadow-xl backdrop-blur-md text-xs flex flex-col gap-1">
                              <span className="font-bold text-white">{data.peptide} ({data.dateLabel} {data.time})</span>
                              {data.recovery !== null && <span className="text-emerald-400 font-medium">Recovery: {data.recovery}/10</span>}
                              {data.energy !== null && <span className="text-cyan-400 font-medium">Energy: {data.energy}/10</span>}
                              {data.sleep !== null && <span className="text-purple-400 font-medium">Sleep: {data.sleep}/10</span>}
                              {data.hairSkinNails !== null && <span className="text-pink-400 font-medium">Hair, Nails & Skin: {data.hairSkinNails}/10</span>}
                              {data.foodHabit && <span className="text-amber-300 font-medium">Food Habit: {data.foodHabit}</span>}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="recovery" name="Recovery" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
                    <Line type="monotone" dataKey="energy" name="Energy" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
                    <Line type="monotone" dataKey="sleep" name="Sleep" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
                    <Line type="monotone" dataKey="hairSkinNails" name="Hair, Nails & Skin" stroke="#f472b6" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                Need at least 2 recorded doses with subjective ratings (recovery, energy, or sleep) to render subjective trend lines.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400">
              <Download className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Export & Backup Research</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Export all your active protocols, custom peptide profiles, administration logs, and settings to a JSON backup file or CSV spreadsheet.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={handleExportJson}
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
              >
                <Database className="w-4 h-4" />
                <span>Download Full Database Backup (.json)</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export Administration Logs (.csv)</span>
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <Upload className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Restore / Import Data</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Restore protocols and logs from a previously exported JSON backup file on another device or browser.
            </p>
            <div className="mt-2">
              <label className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-dashed border-slate-600 transition flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Select JSON File to Restore</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Pharmacokinetics Concentration Curve Simulator (Estimated Active Levels in Your Body) */}
      <div className="mt-2">
        <PkDecayChart protocols={protocols} />
      </div>
    </div>
  );
};
