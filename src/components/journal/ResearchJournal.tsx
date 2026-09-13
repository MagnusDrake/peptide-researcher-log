import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
  Utensils,
  Scale,
  FileSpreadsheet,
  Database,
  FileText,
  Image as ImageIcon,
  Search,
  X,
  Maximize2,
  Camera,
  ArrowUpDown
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
  const [filterMode, setFilterMode] = useState<'all' | 'notes' | 'photos'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; date: string; notes?: string } | null>(null);

  const peptideNames = useMemo(() => {
    const names = new Set<string>();
    logs.forEach(l => names.add(l.peptideName));
    return Array.from(names);
  }, [logs]);

  // Chronologically sorted and filtered logs
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    // Compound filter
    if (selectedPeptideFilter !== 'all') {
      result = result.filter(l => l.peptideName === selectedPeptideFilter);
    }

    // Media / notes specific filter
    if (filterMode === 'notes') {
      result = result.filter(l => Boolean(l.notes && l.notes.trim().length > 0));
    } else if (filterMode === 'photos') {
      result = result.filter(l => Boolean(l.photoDataUri));
    }

    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.peptideName.toLowerCase().includes(q) ||
        (l.notes && l.notes.toLowerCase().includes(q)) ||
        l.injectionSite.toLowerCase().includes(q) ||
        (l.customReactionText && l.customReactionText.toLowerCase().includes(q)) ||
        (l.subjectiveMetrics?.foodHabit && l.subjectiveMetrics.foodHabit.toLowerCase().includes(q))
      );
    }

    // Chronological order (Newest first vs Oldest first)
    return result.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [logs, selectedPeptideFilter, filterMode, searchQuery, sortOrder]);

  // Summary counts for quick badges
  const notesCount = useMemo(() => logs.filter(l => l.notes && l.notes.trim().length > 0).length, [logs]);
  const photosCount = useMemo(() => logs.filter(l => Boolean(l.photoDataUri)).length, [logs]);


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

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter by Compound */}
          {peptideNames.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedPeptideFilter}
                onChange={(e) => setSelectedPeptideFilter(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Compounds ({logs.length})</option>
                {peptideNames.map(name => (
                  <option key={name} value={name} className="bg-slate-900 text-white">{name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Chronological Sort Toggle */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/50 transition cursor-pointer"
            title={`Sorted chronologically: ${sortOrder === 'newest' ? 'Newest to Oldest' : 'Oldest to Newest'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[0.65rem] uppercase tracking-wider">
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </span>
          </button>

          {/* Media / Content Type Filter Pills */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Logs
            </button>
            <button
              onClick={() => setFilterMode('notes')}
              className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'notes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3 h-3 text-cyan-400" />
              <span>Notes</span>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                {notesCount}
              </span>
            </button>
            <button
              onClick={() => setFilterMode('photos')}
              className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'photos'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3 h-3 text-amber-400" />
              <span>Photos</span>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                {photosCount}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 min-w-[160px] sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search notes, sites, reactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 text-white text-xs rounded-xl pl-8 pr-7 py-1.5 focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: TIMELINE VIEW (CHRONOLOGICAL HISTORY WITH NOTES & PHOTOS) */}
      {activeTab === 'timeline' && (
        <div className="flex flex-col gap-4">
          {/* Active Filter Notice */}
          {(filterMode !== 'all' || searchQuery.trim() !== '') && (
            <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300">
              <span className="flex items-center gap-2">
                <span>Showing {filteredLogs.length} matching {filterMode === 'notes' ? 'entries with notes' : filterMode === 'photos' ? 'entries with photos' : 'logs'}</span>
                {searchQuery && <span className="text-slate-400">matching "{searchQuery}"</span>}
              </span>
              <button
                onClick={() => { setFilterMode('all'); setSearchQuery(''); }}
                className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-200 underline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {filteredLogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredLogs.map(log => {
                const date = new Date(log.timestamp);
                const hasMetrics = log.subjectiveMetrics && Object.values(log.subjectiveMetrics).some(v => v !== undefined);

                return (
                  <div
                    key={log.id}
                    className="glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-start justify-between gap-5 relative overflow-hidden"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-sm">
                        💉
                      </div>

                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        {/* Title & Badges Header */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-100">{log.peptideName}</h3>
                          {log.isBlend && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold border border-purple-800">
                              🧪 Multi-Stack
                            </span>
                          )}
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
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

                        {/* Multi-blend details */}
                        {log.isBlend && log.blendDelivered && log.blendDelivered.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {log.blendDelivered.map((d, idx) => (
                              <span key={idx} className="text-[11px] px-2 py-0.5 bg-slate-900 text-purple-200 rounded-md border border-purple-900/50 font-mono">
                                <strong>{d.peptideName}:</strong> {d.doseAmount} {d.doseUnit}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Chronological Timestamp */}
                        <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Prominent Observation Notes Container */}
                        {log.notes && (
                          <div className="mt-1 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-inner">
                            <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              <FileText className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Administration Notes</span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text">
                              {log.notes}
                            </p>
                          </div>
                        )}

                        {/* Attached Progress Picture */}
                        {log.photoDataUri && (
                          <div className="mt-2">
                            <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                              <Camera className="w-3.5 h-3.5 text-amber-400" />
                              <span>Attached Progress Picture</span>
                            </div>
                            <div 
                              onClick={() => setPreviewPhoto({
                                url: log.photoDataUri!,
                                title: `${log.peptideName} Progress Photo`,
                                date: `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                                notes: log.notes
                              })}
                              className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-amber-400/80 transition-all duration-300 cursor-pointer group relative shadow-lg hover:shadow-amber-500/10"
                            >
                              <img 
                                src={log.photoDataUri} 
                                alt={`${log.peptideName} Progress`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px]">
                                <Maximize2 className="w-5 h-5 text-amber-400 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">View Full Photo</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Subjective Biometrics Badges */}
                        {hasMetrics && log.subjectiveMetrics && (
                          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-800/60">
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
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-2.5 rounded-xl hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition"
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
              <h3 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em]">
                {searchQuery || filterMode !== 'all' ? 'No Matching Records Found' : 'No Doses Logged Yet'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                {searchQuery || filterMode !== 'all' 
                  ? 'Try adjusting your filters or search query to view other dose administration entries.'
                  : "Log your first dose from Today's Schedule to start seeing your history and charts here."}
              </p>
              {(searchQuery || filterMode !== 'all') && (
                <button
                  onClick={() => { setFilterMode('all'); setSearchQuery(''); setSelectedPeptideFilter('all'); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs transition"
                >
                  Reset All Filters
                </button>
              )}
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

      {/* FULL RESOLUTION PHOTO LIGHTBOX MODAL */}
      {previewPhoto && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewPhoto(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col my-auto relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Dose Administration Record</span>
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-0.5">{previewPhoto.title}</h3>
                <span className="text-xs text-slate-400 font-mono">{previewPhoto.date}</span>
              </div>

              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="bg-black flex items-center justify-center max-h-[70vh] overflow-hidden p-2">
              <img 
                src={previewPhoto.url} 
                alt={previewPhoto.title}
                className="max-h-[66vh] max-w-full object-contain rounded-xl shadow-lg" 
              />
            </div>

            {/* Modal Footer / Notes */}
            {previewPhoto.notes && (
              <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60">
                <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Observation Notes</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic select-text">
                  "{previewPhoto.notes}"
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
