import React, { useState, useEffect } from 'react';
import { Protocol } from '../../types';
import { PEPTIDES_DATABASE } from '../../data/peptides';
import { simulatePharmacokinetics, calculateSteadyStateTime } from '../../utils/pharmacokinetics';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { Activity, Clock, Info, Sparkles } from 'lucide-react';

interface PkDecayChartProps {
  protocols: Protocol[];
  selectedProtocolId?: string;
}

export const PkDecayChart: React.FC<PkDecayChartProps> = ({
  protocols,
  selectedProtocolId: initialSelectedId,
}) => {
  const activeProtocols = protocols.filter(p => p.isActive);
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId || (activeProtocols.length > 0 ? activeProtocols[0].id : '')
  );
  const [simulationDays, setSimulationDays] = useState<number>(14);

  // Keep selectedId in sync if protocols change
  useEffect(() => {
    if (activeProtocols.length > 0) {
      if (!selectedId || !activeProtocols.some(p => p.id === selectedId)) {
        setSelectedId(activeProtocols[0].id);
      }
    } else {
      setSelectedId('');
    }
  }, [protocols]);

  const currentProtocol = activeProtocols.find(p => p.id === selectedId) || activeProtocols[0];

  // If no active protocol exists, display a clear empty state
  if (!currentProtocol) {
    return (
      <div className="glass-panel p-8 sm:p-10 rounded-3xl flex flex-col items-center justify-center text-center gap-3 border-slate-800 shadow-xl">
        <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-1">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          No Active Protocols to Model
        </h3>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed">
          Once you create a routine or adopt a curated stack in <strong>"My Routines"</strong>, Aura will automatically model its real-time chemical half-life, peak/trough levels, and blood accumulation curve here.
        </p>
      </div>
    );
  }

  // Resolve peptide half-life
  const peptideInfo = PEPTIDES_DATABASE.find(
    p => p.id === currentProtocol.peptideId || p.name.toLowerCase() === currentProtocol.peptideName.toLowerCase()
  );

  const halfLifeHours = peptideInfo ? peptideInfo.halfLifeHours : 4; // Default 4 hours if custom peptide
  const doseAmount = currentProtocol.doseAmount || 250;

  // Determine interval in hours based on protocol frequency
  let dosingIntervalHours = 24; // Daily default
  if (currentProtocol.frequencyType === 'weekly' || currentProtocol.daysOfWeek?.length === 1) {
    dosingIntervalHours = 168; // 7 days
  } else if (currentProtocol.daysOfWeek?.length === 2) {
    dosingIntervalHours = 84; // 3.5 days
  } else if (currentProtocol.daysOfWeek?.length === 3) {
    dosingIntervalHours = 56; // Mon/Wed/Fri avg
  } else if (currentProtocol.daysOfWeek?.length === 5) {
    dosingIntervalHours = 24; // 5 days on
  }

  const chartData = simulatePharmacokinetics({
    doseAmount,
    halfLifeHours,
    dosingIntervalHours,
    totalDays: simulationDays
  });

  const steadyStateInfo = calculateSteadyStateTime(halfLifeHours);

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col gap-5 border-slate-800 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Estimated Active Levels in Your Body</span>
            </h3>
            <p className="text-xs text-slate-400">
              Shows how much peptide builds up and remains active in your system based on your dosing schedule
            </p>
          </div>
        </div>

        {/* Protocol Selector Dropdown & Timeline Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeProtocols.length > 1 && (
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-2 focus:border-cyan-400 outline-none cursor-pointer"
            >
              {activeProtocols.map(p => (
                <option key={p.id} value={p.id}>{p.peptideName} ({p.doseAmount}{p.doseUnit})</option>
              ))}
            </select>
          )}

          <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs">
            {[7, 14, 28].map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setSimulationDays(d)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  simulationDays === d ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PK Key Highlights Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-medium block">Half-Life (Time in Body)</span>
          <span className="text-base font-extrabold text-cyan-300 font-mono mt-0.5">{halfLifeHours} Hours</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-medium block">Peak Steady Level</span>
          <span className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">~{steadyStateInfo.days} Days</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-medium block">Dosing Schedule</span>
          <span className="text-base font-extrabold text-purple-300 font-mono mt-0.5">Every {dosingIntervalHours}h</span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pkGradient" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #1e293b)" vertical={false} />
            
            <XAxis
              dataKey="timeHours"
              stroke="#64748b"
              fontSize={10}
              tickFormatter={(hour) => `Day ${Math.floor(hour / 24) + 1}`}
              interval={Math.floor(chartData.length / 7)}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              domain={[0, 'auto']}
              tickFormatter={(val) => `${val}`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-cyan-500/40 p-3 rounded-xl shadow-2xl text-xs">
                      <div className="text-slate-400 font-mono">{data.dayLabel} • Hour {data.timeHours}</div>
                      <div className="text-cyan-300 font-extrabold text-sm font-mono mt-0.5">
                        {data.concentration} <span className="text-[10px] text-slate-400 font-normal">rel. units</span>
                      </div>
                      {data.doseAdministered && (
                        <div className="text-[10px] text-emerald-400 font-bold mt-1">
                          💉 Dose Administered: {data.doseAdministered}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="concentration"
              stroke="#22d3ee"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#pkGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-start gap-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          {steadyStateInfo.description} Peaks and troughs indicate circulating hormone/peptide fluctuations prior to the next scheduled administration.
        </span>
      </div>
    </div>
  );
};
