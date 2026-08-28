import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Protocol } from '../../types';
import { formatTiming, formatDaysOfWeek } from '../../utils/formatters';
import { generateShareableProtocolText, triggerDownload } from '../../utils/exportImport';
import { 
  Calendar, 
  Clock, 
  ThermometerSnowflake, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Share2, 
  PlusCircle, 
  Copy, 
  Check, 
  RotateCcw,
  X 
} from 'lucide-react';

interface VialStatusCardProps {
  protocol: Protocol;
  onEdit: (protocol: Protocol) => void;
  onDelete: (protocolId: string) => void;
  onToggleActive: (protocol: Protocol) => void;
  onLogDose: (protocol: Protocol) => void;
  logsCount?: number;
}

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const VialStatusCard: React.FC<VialStatusCardProps> = ({
  protocol,
  onEdit,
  onDelete,
  onToggleActive,
  onLogDose,
  logsCount = 0,
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculate days since reconstitution
  const reconDate = protocol.reconstitutedDate ? new Date(protocol.reconstitutedDate) : new Date(protocol.startDate);
  const today = new Date();
  const daysSinceRecon = Math.max(0, Math.floor((today.getTime() - reconDate.getTime()) / (1000 * 60 * 60 * 24)));
  const maxShelfLifeDays = 28;
  const daysRemainingInShelfLife = Math.max(0, maxShelfLifeDays - daysSinceRecon);

  // Calculate freshness status
  let freshnessColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let freshnessText = `Day ${daysSinceRecon} of ${maxShelfLifeDays} (Optimal Potency)`;
  if (daysSinceRecon > 28) {
    freshnessColor = 'text-red-400 bg-red-500/10 border-red-500/30';
    freshnessText = `Expired (${daysSinceRecon} days since reconstitution)`;
  } else if (daysSinceRecon > 21) {
    freshnessColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    freshnessText = `Use Soon (${daysRemainingInShelfLife} days remaining)`;
  }

  // Check if today is a scheduled day
  const todayDayIndex = today.getDay();
  const isScheduledToday = protocol.daysOfWeek.includes(todayDayIndex) || protocol.frequencyType === 'daily';

  const shareText = generateShareableProtocolText(protocol, logsCount);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`glass-panel rounded-3xl p-6 flex flex-col justify-between gap-5 relative transition shadow-xl border ${
      protocol.isActive ? 'border-slate-800 hover:border-cyan-500/30' : 'border-slate-900 opacity-60'
    }`}>
      
      {/* Top Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            {protocol.isBlend ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                <span>🧪</span>
                <span>{protocol.blendComponents?.length || 2}-Peptide Stack</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {protocol.doseAmount} {protocol.doseUnit}
              </span>
            )}
            {protocol.brandName && (
              <span className="text-[11px] text-slate-400 font-medium">
                • {protocol.brandName}
              </span>
            )}
            {protocol.batchNumber && (
              <span className="text-[10px] text-slate-500 font-mono">
                [{protocol.batchNumber}]
              </span>
            )}
          </div>

          <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-100 mt-1.5 flex items-center gap-2">
            <span>{protocol.peptideName}</span>
            {isScheduledToday && protocol.isActive && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" title="Scheduled for today!" />
            )}
          </h3>
        </div>

        {/* Dropdown menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-30 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl w-44 flex flex-col gap-1 text-xs">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(protocol);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-left transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Edit Protocol</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowShareModal(true);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-left transition"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Share / Export Card</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onToggleActive(protocol);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-left transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>{protocol.isActive ? 'Pause Protocol' : 'Resume Protocol'}</span>
              </button>

              <div className="border-t border-slate-800 my-0.5" />

              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(protocol.id);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-950/60 text-red-400 text-left transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Protocol</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Syringe & Dosage Snapshot Box */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400">Draw into Syringe</span>
          <div className="text-2xl font-black text-cyan-400 font-mono flex items-baseline gap-1">
            <span>{protocol.calculatedUnits}</span>
            <span className="text-xs font-bold text-slate-400 uppercase">units</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {protocol.syringeType} • {(protocol.calculatedUnits * 0.01).toFixed(2)} mL
          </span>
        </div>

        <div className="text-right flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400">Reconstitution</span>
          <span className="text-sm font-bold text-slate-200 font-mono">
            {protocol.vialMassMg}mg in {protocol.bacWaterMl}mL
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">
            {protocol.concentrationMgMl} mg/mL
          </span>
        </div>
      </div>

      {/* Multi-Peptide Constituent Breakdown (if Blend) */}
      {protocol.isBlend && protocol.blendComponents && protocol.blendComponents.length > 0 && (
        <div className="bg-purple-950/30 border border-purple-800/50 rounded-2xl p-3 flex flex-col gap-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center justify-between">
            <span>Stack Formulation</span>
            <span>{protocol.blendComponents.length} Compounds</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {protocol.blendComponents.map(comp => (
              <span 
                key={comp.id}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 text-purple-200 border border-purple-900/60 font-medium flex items-center gap-1.5"
              >
                <span className="font-bold text-white">{comp.peptideName}:</span>
                <span className="font-mono text-cyan-300">
                  {comp.deliveredDose ? `${comp.deliveredDose} ${comp.deliveredUnit || 'mcg'}` : `${comp.targetDose} ${comp.doseUnit}`}
                </span>
                <span className="text-[10px] text-slate-500">({comp.vialMassMg}mg)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Days of Week Badges */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Scheduled Days</span>
          <span className="text-slate-300 font-semibold">{formatTiming(protocol.timingOfDay)}</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS_SHORT.map((dayName, idx) => {
            const isDayScheduled = protocol.daysOfWeek.includes(idx) || protocol.frequencyType === 'daily';
            const isToday = todayDayIndex === idx;

            return (
              <div
                key={dayName}
                className={`py-1.5 rounded-lg text-center text-[10px] font-bold transition ${
                  isDayScheduled
                    ? isToday
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/50'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-950 text-slate-600'
                }`}
              >
                {dayName}
              </div>
            );
          })}
        </div>
      </div>

      {/* Freshness & Depletion Watchdogs */}
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-800/80 text-xs">
        {/* Reconstitution Freshness Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px]">Vial Freshness:</span>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${freshnessColor}`}>
            {freshnessText}
          </span>
        </div>

        {/* Administrations recorded */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Administrations Logged:</span>
          <span className="font-bold text-slate-200 font-mono">{logsCount} doses</span>
        </div>
      </div>

      {/* Bottom Action Button */}
      {protocol.isActive && (
        <button
          onClick={() => onLogDose(protocol)}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
            isScheduledToday
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20 active:scale-95'
              : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isScheduledToday ? "Log Today's Administration" : 'Log Dose Entry'}</span>
        </button>
      )}

      {/* Share / Export Protocol Modal */}
      {showShareModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Shareable Protocol Card</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
              {shareText}
            </pre>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleCopyShare}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
