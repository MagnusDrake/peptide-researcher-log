import React, { useState } from 'react';
import { Protocol } from '../../types';
import { db } from '../../db';
import { VialStatusCard } from './VialStatusCard';
import { ProtocolFormModal } from './ProtocolFormModal';
import { Plus, Sparkles, Layers, Activity, CalendarCheck2, ShieldCheck } from 'lucide-react';

interface ProtocolManagerProps {
  protocols: Protocol[];
  onProtocolsChanged: () => void;
  onLogDose: (protocol: Protocol) => void;
  logsCountMap?: Record<string, number>;
  initialModalOpen?: boolean;
  initialProtocolData?: Partial<Protocol> | null;
}

export const ProtocolManager: React.FC<ProtocolManagerProps> = ({
  protocols,
  onProtocolsChanged,
  onLogDose,
  logsCountMap = {},
  initialModalOpen = false,
  initialProtocolData = null,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(initialModalOpen);
  const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'paused'>('active');

  const activeProtocols = protocols.filter(p => p.isActive);
  const pausedProtocols = protocols.filter(p => !p.isActive);

  const displayedProtocols = filterActive === 'all' 
    ? protocols 
    : filterActive === 'active' 
      ? activeProtocols 
      : pausedProtocols;

  const handleEdit = (protocol: Protocol) => {
    setEditingProtocol(protocol);
    setIsModalOpen(true);
  };

  const handleDelete = async (protocolId: string) => {
    if (confirm('Are you sure you want to delete this research protocol? Log history will remain preserved.')) {
      await db.protocols.delete(protocolId);
      onProtocolsChanged();
    }
  };

  const handleToggleActive = async (protocol: Protocol) => {
    await db.protocols.update(protocol.id, { isActive: !protocol.isActive });
    onProtocolsChanged();
  };

  const handleCreateNew = () => {
    setEditingProtocol(null);
    setIsModalOpen(true);
  };

  // Calculate total weekly injections scheduled across active protocols
  const totalWeeklyInjections = activeProtocols.reduce((sum, p) => {
    if (p.frequencyType === 'daily') return sum + 7;
    return sum + (p.daysOfWeek?.length || 0);
  }, 0);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Active Stack & Regimen Center</span>
          </div>
          <h1 className="text-2xl font-light text-slate-100 tracking-[0.1em] uppercase">
            Research Protocols & Active Stacks
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Configure compound dosages, reconstitution ratios, day-of-week administration schedules, and reconstituted vial shelf-life tracking.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 btn-glow-cyan hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Protocol</span>
        </button>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">Active Compounds</span>
            <span className="text-2xl font-black text-white font-mono">{activeProtocols.length}</span>
            <span className="text-[11px] text-slate-500 block">in current research stack</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">Weekly Injections</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{totalWeeklyInjections}</span>
            <span className="text-[11px] text-slate-500 block">scheduled per 7-day cycle</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">Vials Monitored</span>
            <span className="text-2xl font-black text-purple-300 font-mono">{protocols.length}</span>
            <span className="text-[11px] text-slate-500 block">with 28-day stability clocks</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterActive('active')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              filterActive === 'active' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active ({activeProtocols.length})
          </button>
          <button
            onClick={() => setFilterActive('paused')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              filterActive === 'paused' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Paused ({pausedProtocols.length})
          </button>
          <button
            onClick={() => setFilterActive('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              filterActive === 'all' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onLogDose={onLogDose}
              logsCount={logsCountMap[protocol.id] || 0}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
          <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-3xl">
            🧪
          </div>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">No Protocols Found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            {filterActive === 'active'
              ? "You don't have any active research protocols yet. Create your first protocol to start scheduling and tracking."
              : 'No protocols in this tab.'}
          </p>
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 btn-glow-cyan hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-500/20 mt-2"
          >
            Create Your First Protocol
          </button>
        </div>
      )}

      {/* Protocol Form Modal */}
      <ProtocolFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProtocol(null);
        }}
        onSaved={() => {
          onProtocolsChanged();
        }}
        editingProtocol={editingProtocol}
        initialData={initialProtocolData}
      />
    </div>
  );
};
