import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  HelpCircle, 
  Send, 
  X, 
  CheckCircle2, 
  User, 
  Clock, 
  Tag, 
  CornerDownRight, 
  ShieldCheck 
} from 'lucide-react';

export type QuestionCategory = 'all' | 'compounding' | 'healing' | 'glp1' | 'longevity' | 'general';

export interface DiscussionAnswer {
  id: string;
  author: string;
  avatarColor?: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isVerified?: boolean;
}

export interface DiscussionQuestion {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'compounding' | 'healing' | 'glp1' | 'longevity' | 'general';
  peptidesTagged: string[];
  timestamp: string;
  upvotes: number;
  answers: DiscussionAnswer[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'compounding', label: '💉 Compounding & Mixing' },
  { id: 'healing', label: '🩹 Healing & Tissue Repair' },
  { id: 'glp1', label: '⚖️ GLP-1 & Metabolism' },
  { id: 'longevity', label: '🧠 Longevity & Nootropics' },
  { id: 'general', label: '🔬 General Research' },
];

const INITIAL_QUESTIONS: DiscussionQuestion[] = [
  {
    id: 'q-1',
    title: 'What is the optimal BAC water ratio for 10mg Retatrutide vs 5mg vials?',
    content: 'I recently received 10mg vials of Retatrutide. For my previous 5mg vials, I used 2.0mL BAC water to get 250mcg per 10 units. Should I use 2.0mL or 3.0mL on the 10mg vial to maintain accurate tick draw on a U-100 syringe?',
    author: 'AuraBiohacker',
    category: 'compounding',
    peptidesTagged: ['Retatrutide'],
    timestamp: '2 hours ago',
    upvotes: 19,
    answers: [
      {
        id: 'a-1-1',
        author: 'PeptideChemist_PhD',
        content: 'If you add 2.0mL of BAC water to a 10mg vial, your concentration will be exactly 5.0mg/mL (50mcg per unit on a U-100 syringe). To draw a starting dose of 2.0mg, draw exactly 40 units. 2.0mL is the sweet spot because higher liquid volumes take longer to inject SubQ.',
        timestamp: '1 hour ago',
        upvotes: 14,
        isVerified: true
      },
      {
        id: 'a-1-2',
        author: 'DoseTracker_99',
        content: 'Agreed with 2.0mL. You can also use the Mix Calculator inside the app—it will render the exact syringe barrel marks so you do not have to do math by hand.',
        timestamp: '45 mins ago',
        upvotes: 8
      }
    ]
  },
  {
    id: 'q-2',
    title: 'Can BPC-157 be administered orally for gut issues while using SubQ for shoulder tendonitis?',
    content: 'Dealing with both chronic gastritis and a rotator cuff tear. Is there any issue running an oral BPC-157 liquid/capsule protocol in the morning and a SubQ injection near the shoulder in the evening?',
    author: 'CrossfitRecovery',
    category: 'healing',
    peptidesTagged: ['BPC-157', 'TB-500'],
    timestamp: '1 day ago',
    upvotes: 27,
    answers: [
      {
        id: 'a-2-1',
        author: 'SportsMed_Bio',
        content: 'BPC-157 is gastric juice stable (especially the Arginate salt form). Oral administration has strong localized affinity for GI epithelium, while SubQ creates systemic angiogenic support for tendons. Many athletes run 250mcg orally fasted + 250mcg SubQ post-workout with excellent synergy.',
        timestamp: '18 hours ago',
        upvotes: 21,
        isVerified: true
      }
    ]
  },
  {
    id: 'q-3',
    title: 'Managing the transition from 5mg Tirzepatide to 7.5mg without lethargy',
    content: 'Been on 5.0mg Tirzepatide for 6 weeks. Weight loss has slowed slightly, so I am preparing to titrate to 7.5mg. Any tips on preventing the day-after fatigue that happened when I started 5mg?',
    author: 'EndoExplorer',
    category: 'glp1',
    peptidesTagged: ['Tirzepatide'],
    timestamp: '2 days ago',
    upvotes: 34,
    answers: [
      {
        id: 'a-3-1',
        author: 'BioClinical',
        content: 'Two proven protocols: 1) Increase your morning electrolytes (at least 500mg sodium + 200mg potassium in water before injecting). 2) Consider a split dose: 3.75mg on Monday morning and 3.75mg on Thursday evening instead of one massive 7.5mg single bolus.',
        timestamp: '1 day ago',
        upvotes: 29,
        isVerified: true
      }
    ]
  },
  {
    id: 'q-4',
    title: 'Combining Epithalon and GHK-Cu for cellular repair & skin longevity',
    content: 'Has anyone paired a 10-day Epithalon cycle (10mg/day) with a 30-day GHK-Cu protocol (2mg/day)? Looking for guidance on injection site rotation and timing.',
    author: 'LongevityFanatic',
    category: 'longevity',
    peptidesTagged: ['Epithalon', 'GHK-Cu'],
    timestamp: '3 days ago',
    upvotes: 18,
    answers: [
      {
        id: 'a-4-1',
        author: 'TelomereResearch',
        content: 'Epithalon is best taken in the evening or before bedtime since it upregulates melatonin synthesis and pineal function. GHK-Cu can be taken in the morning. Make sure to rotate abdominal quadrants for GHK-Cu to avoid site soreness.',
        timestamp: '2 days ago',
        upvotes: 12
      }
    ]
  }
];

export const DiscussionBoard: React.FC = () => {
  const [questions, setQuestions] = useState<DiscussionQuestion[]>(() => {
    const saved = localStorage.getItem('aura_community_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuestionForDetails, setActiveQuestionForDetails] = useState<DiscussionQuestion | null>(null);
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);

  // New question form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'compounding' | 'healing' | 'glp1' | 'longevity' | 'general'>('compounding');
  const [newTags, setNewTags] = useState('');
  const [authorName, setAuthorName] = useState(() => localStorage.getItem('aura_researcher_name') || 'Researcher_' + Math.floor(1000 + Math.random() * 9000));

  // Answer form state
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('aura_community_questions', JSON.stringify(questions));
  }, [questions]);

  const handleUpvoteQuestion = (qId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (upvotedIds.has(qId)) return;
    setUpvotedIds(new Set([...upvotedIds, qId]));
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q));
    if (activeQuestionForDetails && activeQuestionForDetails.id === qId) {
      setActiveQuestionForDetails(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
    }
  };

  const handleUpvoteAnswer = (qId: string, aId: string) => {
    if (upvotedIds.has(aId)) return;
    setUpvotedIds(new Set([...upvotedIds, aId]));
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;
      return {
        ...q,
        answers: q.answers.map(a => a.id === aId ? { ...a, upvotes: a.upvotes + 1 } : a)
      };
    }));
    if (activeQuestionForDetails && activeQuestionForDetails.id === qId) {
      setActiveQuestionForDetails(prev => {
        if (!prev) return null;
        return {
          ...prev,
          answers: prev.answers.map(a => a.id === aId ? { ...a, upvotes: a.upvotes + 1 } : a)
        };
      });
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newQ: DiscussionQuestion = {
      id: `q-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: authorName.trim() || 'Anonymous Researcher',
      category: newCategory,
      peptidesTagged: parsedTags.length > 0 ? parsedTags : ['Peptides'],
      timestamp: 'Just now',
      upvotes: 1,
      answers: []
    };

    setQuestions(prev => [newQ, ...prev]);
    setIsAskModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestionForDetails || !newAnswerContent.trim()) return;

    const answer: DiscussionAnswer = {
      id: `a-${Date.now()}`,
      author: authorName.trim() || 'Anonymous Researcher',
      content: newAnswerContent.trim(),
      timestamp: 'Just now',
      upvotes: 1
    };

    const updated = {
      ...activeQuestionForDetails,
      answers: [...activeQuestionForDetails.answers, answer]
    };

    setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));
    setActiveQuestionForDetails(updated);
    setNewAnswerContent('');
  };

  const filteredQuestions = questions.filter(q => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const s = searchQuery.toLowerCase();
    return q.title.toLowerCase().includes(s) || 
           q.content.toLowerCase().includes(s) || 
           q.peptidesTagged.some(t => t.toLowerCase().includes(s));
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner & Action */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Peer Research Q&A</span>
          </div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Questions, Answers & Protocols
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Ask compounding questions, share observation tips, and get answers from verified peer researchers.
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search questions by topic, compound name (e.g. BPC-157, Tirzepatide), or question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-2xl pl-11 pr-4 py-3 focus:border-cyan-400 outline-none placeholder:text-slate-500 shadow-inner"
          />
        </div>
      </div>

      {/* Questions Grid */}
      {filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuestions.map(q => (
            <div
              key={q.id}
              onClick={() => setActiveQuestionForDetails(q)}
              className="glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 hover:border-cyan-500/40 transition flex flex-col gap-3 shadow-xl cursor-pointer group"
            >
              {/* Top Meta */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {q.author}
                  </span>
                  {q.peptidesTagged.map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{q.timestamp}</span>
                </span>
              </div>

              {/* Title & Preview */}
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {q.content}
                </p>
              </div>

              {/* Footer Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 text-slate-400 font-mono font-semibold">
                  <button
                    onClick={(e) => handleUpvoteQuestion(q.id, e)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition cursor-pointer ${
                      upvotedIds.has(q.id)
                        ? 'bg-cyan-500 text-white border-cyan-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{q.upvotes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{q.answers.length} {q.answers.length === 1 ? 'Answer' : 'Answers'}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>View Thread</span>
                  <CornerDownRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center text-xs text-slate-400">
          No questions found matching your filter. Be the first to ask!
        </div>
      )}

      {/* QUESTION DETAIL / ANSWERS MODAL */}
      {activeQuestionForDetails && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                    {activeQuestionForDetails.author}
                  </span>
                  {activeQuestionForDetails.peptidesTagged.map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono">
                      {tag}
                    </span>
                  ))}
                  <span className="text-slate-500 text-xs font-mono">• {activeQuestionForDetails.timestamp}</span>
                </div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {activeQuestionForDetails.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveQuestionForDetails(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Question Content & Answers */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs text-slate-300">
              
              {/* Question Body */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-sm leading-relaxed text-slate-200">
                {activeQuestionForDetails.content}
                
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleUpvoteQuestion(activeQuestionForDetails.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      upvotedIds.has(activeQuestionForDetails.id)
                        ? 'bg-cyan-500 text-white border-cyan-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({activeQuestionForDetails.upvotes})</span>
                  </button>

                  <span className="text-slate-400 font-medium">
                    {activeQuestionForDetails.answers.length} Responses
                  </span>
                </div>
              </div>

              {/* Answers Thread */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Peer Responses & Verified Advice</span>
                </h3>

                {activeQuestionForDetails.answers.length > 0 ? (
                  activeQuestionForDetails.answers.map(ans => (
                    <div
                      key={ans.id}
                      className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col gap-2.5 shadow-lg"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200 text-xs">{ans.author}</span>
                          {ans.isVerified && (
                            <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Protocol</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{ans.timestamp}</span>
                      </div>

                      <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                        {ans.content}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                        <button
                          onClick={() => handleUpvoteAnswer(activeQuestionForDetails.id, ans.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            upvotedIds.has(ans.id)
                              ? 'bg-emerald-500 text-white border-emerald-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{ans.upvotes} Upvotes</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                    No responses yet. Be the first to share your experience!
                  </div>
                )}
              </div>

              {/* Add Response Box */}
              <form onSubmit={handleAddAnswer} className="mt-2 flex flex-col gap-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Post Your Reply or Research Observation
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type your response, compounding recommendation, or research finding..."
                  value={newAnswerContent}
                  onChange={(e) => setNewAnswerContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm rounded-2xl p-4 focus:border-cyan-400 outline-none resize-none shadow-inner"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Response</span>
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ASK QUESTION MODAL */}
      {isAskModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>Ask a Research Question</span>
              </h3>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 flex flex-col gap-4 text-xs text-slate-300">
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Topic Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-cyan-400 outline-none"
                >
                  <option value="compounding">💉 Compounding & Mixing</option>
                  <option value="healing">🩹 Healing & Tissue Repair</option>
                  <option value="glp1">⚖️ GLP-1 & Metabolism</option>
                  <option value="longevity">🧠 Longevity & Nootropics</option>
                  <option value="general">🔬 General Protocol Research</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Question Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best bacteriostatic water ratio for BPC-157 5mg?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Compound Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. BPC-157, TB-500, BAC Water"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-cyan-400 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Details & Context *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your compounding scenario, injection schedule, or what you've observed..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-cyan-400 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Post Question
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
