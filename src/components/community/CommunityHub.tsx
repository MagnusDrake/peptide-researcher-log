import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Protocol, DoseLogEntry } from '../../types';
import { db, SharedCommunityFinding } from '../../db';
import { RedditFeed } from './RedditFeed';
import { DiscussionBoard } from './DiscussionBoard';
import { 
  Users, 
  Share2, 
  ThumbsUp, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  BookmarkPlus, 
  MessageSquare, 
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  FlaskConical
} from 'lucide-react';

interface CommunityHubProps {
  protocols: Protocol[];
  logs: DoseLogEntry[];
  onAdoptProtocol?: (initialData: Partial<Protocol>) => void;
}

export type CommunitySubTab = 'discussions' | 'reddit' | 'protocols';

export const CommunityHub: React.FC<CommunityHubProps> = ({
  protocols,
  logs,
  onAdoptProtocol,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<CommunitySubTab>('discussions');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [findings, setFindings] = useState<SharedCommunityFinding[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(protocols[0]?.id || '');
  const [researcherAlias, setResearcherAlias] = useState<string>(() => localStorage.getItem('aura_researcher_name') || 'Researcher_' + Math.floor(1000 + Math.random() * 9000));
  const [outcomesSummary, setOutcomesSummary] = useState<string>('');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadFindings() {
      const items = await db.sharedCommunityFindings.toArray();
      setFindings(items);
    }
    loadFindings();
  }, []);

  const handleSubTabChange = (newTab: CommunitySubTab) => {
    if (newTab === activeSubTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSubTab(newTab);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      });
    }, 300);
  };

  const handleUpvote = (id: string) => {
    if (upvotedIds.has(id)) return;
    setUpvotedIds(new Set([...upvotedIds, id]));
    setFindings(prev => prev.map(f => f.id === id ? { ...f, upvotes: f.upvotes + 1 } : f));
  };

  const handlePublishFinding = async (e: React.FormEvent) => {
    e.preventDefault();
    const proto = protocols.find(p => p.id === selectedProtocolId);
    if (!proto || !outcomesSummary.trim()) return;

    const newFinding: SharedCommunityFinding = {
      id: `comm-${Date.now()}`,
      researcherAlias: researcherAlias.trim() || 'Anonymous Researcher',
      peptideName: proto.peptideName,
      protocolSummary: `${proto.doseAmount}${proto.doseUnit} (${proto.calculatedUnits}u), ${proto.frequencyType === 'daily' ? 'Daily' : 'Scheduled days'}, ${proto.plannedCycleWeeks} wks`,
      durationWeeks: proto.plannedCycleWeeks,
      outcomesSummary: outcomesSummary.trim(),
      subjectiveRatings: {
        recoveryAvg: 8.5,
        energyAvg: 8.0,
        sideEffects: 'None noted'
      },
      dateShared: new Date().toISOString().split('T')[0],
      upvotes: 1
    };

    await db.sharedCommunityFindings.put(newFinding);
    setFindings(prev => [newFinding, ...prev]);
    setIsShareModalOpen(false);
    setOutcomesSummary('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Global Peer Network</span>
          </div>
          <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest">
            Community Hub & Live Research
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Explore live discussions from global research subreddits, ask compounding questions, and clone proven protocols.
          </p>
        </div>

        {activeSubTab === 'protocols' && (
          <button
            onClick={() => setIsShareModalOpen(true)}
            disabled={protocols.length === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Your Routine</span>
          </button>
        )}
      </div>

      {/* Main Sub-Tab Switcher */}
      <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto pb-1 scrollbar-none">
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner shrink-0">
          <button
            onClick={() => handleSubTabChange('discussions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeSubTab === 'discussions'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Aura Q&A Forum</span>
          </button>

          <button
            onClick={() => handleSubTabChange('reddit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeSubTab === 'reddit'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>Live Reddit Streams</span>
          </button>

          <button
            onClick={() => handleSubTabChange('protocols')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeSubTab === 'protocols'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <span>Shared Routines ({findings.length})</span>
          </button>
        </div>
      </div>

      {/* Transition Container for Sub-Views */}
      <div className={`transition-all duration-[300ms] ease-out ${
        isTransitioning ? 'opacity-0 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0'
      }`}>
        
        {/* SUB-VIEW 1: AURA Q&A & DISCUSSION BOARD */}
        {activeSubTab === 'discussions' && (
          <DiscussionBoard />
        )}

        {/* SUB-VIEW 2: LIVE REDDIT FORUM FEEDS */}
        {activeSubTab === 'reddit' && (
          <RedditFeed />
        )}

        {/* SUB-VIEW 3: SHARED PROTOCOL LOGS */}
        {activeSubTab === 'protocols' && (
          <div className="flex flex-col gap-6">
            {/* Privacy Alert */}
            <div className="glass-panel p-4 rounded-2xl border-purple-900/40 flex items-start gap-3 text-xs text-purple-200/90">
              <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <strong className="text-white">Privacy-First Architecture:</strong>
                <span>Your local protocols and logs are completely private on your device. Only findings you explicitly choose to publish with an anonymous researcher alias are added to this shared exchange.</span>
              </div>
            </div>

            {/* Findings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {findings.map(finding => (
                <div
                  key={finding.id}
                  className="glass-panel p-6 rounded-3xl flex flex-col justify-between gap-4 border-slate-800 hover:border-purple-500/30 transition shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                        {finding.researcherAlias}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{finding.dateShared}</span>
                    </div>

                    <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-100">{finding.peptideName}</h3>
                    <div className="text-xs font-semibold text-cyan-400 font-mono mt-0.5">
                      Protocol: {finding.protocolSummary}
                    </div>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                      "{finding.outcomesSummary}"
                    </p>

                    {/* Ratings */}
                    <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">Recovery Score</span>
                        <span className="text-emerald-400 font-bold font-mono">{finding.subjectiveRatings.recoveryAvg} / 10</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase block">Energy Score</span>
                        <span className="text-cyan-400 font-bold font-mono">{finding.subjectiveRatings.energyAvg} / 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleUpvote(finding.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        upvotedIds.has(finding.id)
                          ? 'bg-purple-500 text-white border-purple-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{finding.upvotes}</span>
                    </button>

                    {onAdoptProtocol && (
                      <button
                        onClick={() => onAdoptProtocol({ peptideName: finding.peptideName })}
                        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-white font-bold transition cursor-pointer"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Copy to My Routines</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Share Finding Modal */}
      {isShareModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4">
            <h3 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-400" />
              <span>Share Your Routine Anonymously</span>
            </h3>

            <form onSubmit={handlePublishFinding} className="flex flex-col gap-4 text-xs text-slate-300">
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Choose Routine to Share</label>
                <select
                  value={selectedProtocolId}
                  onChange={(e) => setSelectedProtocolId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-purple-400 outline-none"
                >
                  {protocols.map(p => (
                    <option key={p.id} value={p.id}>{p.peptideName} ({p.doseAmount}{p.doseUnit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Anonymous Researcher Handle</label>
                <input
                  type="text"
                  value={researcherAlias}
                  onChange={(e) => setResearcherAlias(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Observed Outcomes & Findings *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share observational effects, recovery speed, side-effect profile, or biometric changes over your cycle..."
                  value={outcomesSummary}
                  onChange={(e) => setOutcomesSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-purple-400 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
