import React, { useState, useEffect } from 'react';
import { INJECTION_SITES } from '../../data/injectionSites';
import { InjectionSite } from '../../types';
import { Shield, Sparkles, RotateCw, User, Eye } from 'lucide-react';

const PIN_STYLES = {
  suggested: {
    fill: '#10b981', // Emerald Green
    stroke: '#34d399',
    glow: 'rgba(16, 185, 129, 0.45)',
    label: 'Suggested Next'
  },
  lastUsed: {
    fill: '#f59e0b', // Amber Orange
    stroke: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.45)',
    label: 'Last Injected'
  },
  available: {
    fill: '#38bdf8', // Sky Blue
    stroke: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.45)',
    label: 'Available Sites'
  },
  selected: {
    fill: '#a855f7', // Purple
    stroke: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.45)',
    label: 'Selected Target'
  }
};

interface SiteRotationMapProps {
  lastUsedSiteName?: string;
  selectedSiteName?: string;
  onSelectSite?: (siteName: string) => void;
  interactive?: boolean;
}

export const SiteRotationMap: React.FC<SiteRotationMapProps> = ({
  lastUsedSiteName,
  selectedSiteName,
  onSelectSite,
  interactive = true,
}) => {
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');

  // Suggest the next rotation site based on last used site
  const lastSiteIndex = INJECTION_SITES.findIndex(s => s.name === lastUsedSiteName);
  const suggestedSiteIndex = lastSiteIndex >= 0 ? (lastSiteIndex + 1) % INJECTION_SITES.length : 0;
  const suggestedSite = INJECTION_SITES[suggestedSiteIndex];

  // If the suggested or selected site is on the other view, auto-adjust view
  useEffect(() => {
    if (selectedSiteName) {
      const site = INJECTION_SITES.find(s => s.name === selectedSiteName);
      if (site && site.view) {
        setCurrentView(site.view);
      }
    } else if (suggestedSite && suggestedSite.view) {
      setCurrentView(suggestedSite.view);
    }
  }, [selectedSiteName, suggestedSite?.id]);

  const visibleSites = INJECTION_SITES.filter(s => s.view === currentView);

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border-slate-800 shadow-xl">
      {/* Header & Rotation Status */}
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Injection Spot Rotation</h3>
            <p className="text-[11px] text-slate-400">Rotate where you inject to prevent soreness and skin bumps</p>
          </div>
        </div>

        {suggestedSite && (
          <div className="flex items-center gap-2 text-xs bg-emerald-950/70 border border-emerald-500/40 p-2.5 rounded-2xl text-emerald-300 w-full shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-slate-300 text-[11px]">Next Recommended:</span>
              <strong className="text-emerald-300 font-bold">{suggestedSite.name}</strong>
            </div>
          </div>
        )}
      </div>

      {/* View Switcher (Front / Back Anatomy) */}
      <div className="flex items-center justify-center pt-1">
        <div 
          role="tablist" 
          aria-label="Anatomical View Selection"
          className="bg-slate-900/90 p-1 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner"
        >
          <button
            type="button"
            role="tab"
            aria-selected={currentView === 'front'}
            onClick={() => setCurrentView('front')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentView === 'front'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Anterior (Front)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={currentView === 'back'}
            onClick={() => setCurrentView('back')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentView === 'back'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Posterior (Back)</span>
          </button>
        </div>
      </div>

      {/* Interactive 2D Anatomical Vector Map */}
      <div className="relative w-full aspect-[3/4] max-h-[420px] mx-auto bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-2 shadow-inner">
        <svg
          viewBox="0 0 300 440"
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(15,23,42,0.6)]"
          aria-label={`Human body diagram (${currentView === 'front' ? 'Anterior / Front' : 'Posterior / Back'} view)`}
          role="region"
        >
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
            </linearGradient>
            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.3" />
            </filter>
            <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.5" />
            </filter>
            <filter id="purpleGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ------------------------------------------------------------- */}
          {/* ANTERIOR (FRONT) BODY SILHOUETTE - REFINED PROPORTIONS */}
          {/* ------------------------------------------------------------- */}
          {currentView === 'front' ? (
            <g className="transition-opacity duration-300">
              {/* Head & Neck */}
              <ellipse cx="150" cy="38" rx="18" ry="24" fill="url(#bodyGradient)" stroke="#334155" strokeWidth="1.5" />
              <path d="M 141 60 C 141 72, 136 78, 132 82 M 159 60 C 159 72, 164 78, 168 82" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Natural Athletic Torso & Arms */}
              <path
                d="M 132 82
                   C 114 86, 92 98, 78 116
                   C 72 126, 74 140, 76 160
                   C 78 185, 78 215, 74 245
                   C 70 275, 64 305, 62 322
                   L 74 322
                   C 78 285, 86 250, 92 220
                   C 96 200, 96 175, 96 150
                   C 96 135, 106 122, 118 120
                   C 128 118, 142 116, 150 116
                   C 158 116, 172 118, 182 120
                   C 194 122, 204 135, 204 150
                   C 204 175, 204 200, 208 220
                   C 214 250, 222 285, 226 322
                   L 238 322
                   C 236 305, 230 275, 226 245
                   C 222 215, 222 185, 224 160
                   C 226 140, 228 126, 222 116
                   C 208 98, 186 86, 168 82
                   Z"
                fill="url(#bodyGradient)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Lower Body: Hips, Quads, Knees, Calves */}
              <path
                d="M 98 145
                   C 98 175, 106 198, 108 218
                   C 110 238, 104 265, 108 295
                   C 114 335, 114 365, 118 395
                   C 120 410, 116 418, 116 425
                   L 134 425
                   C 136 415, 140 390, 140 360
                   C 140 320, 143 270, 150 245
                   C 157 270, 160 320, 160 360
                   C 160 390, 164 415, 166 425
                   L 184 425
                   C 184 418, 180 410, 182 395
                   C 186 365, 186 335, 192 295
                   C 196 265, 190 238, 192 218
                   C 194 198, 202 175, 202 145
                   C 188 152, 168 155, 150 155
                   C 132 155, 112 152, 98 145
                   Z"
                fill="url(#bodyGradient)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Clavicles & Chest Contours */}
              <path d="M 132 88 C 140 92, 146 94, 150 95 C 154 94, 160 92, 168 88" fill="none" stroke="#475569" strokeWidth="1.5" />
              <path d="M 112 125 C 122 138, 142 138, 148 128" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 188 125 C 178 138, 158 138, 152 128" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Linea Alba & Umbilicus (Navel) */}
              <line x1="150" y1="130" x2="150" y2="215" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx="150" cy="180" r="3" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              {/* 2-inch Periumbilical exclusion zone */}
              <circle cx="150" cy="180" r="14" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.45" />

              {/* Kneecaps (Patella) */}
              <ellipse cx="130" cy="342" rx="7" ry="9" fill="none" stroke="#334155" strokeWidth="1.5" />
              <ellipse cx="170" cy="342" rx="7" ry="9" fill="none" stroke="#334155" strokeWidth="1.5" />
            </g>
          ) : (
            /* ------------------------------------------------------------- */
            /* POSTERIOR (BACK) BODY SILHOUETTE - REFINED PROPORTIONS */
            /* ------------------------------------------------------------- */
            <g className="transition-opacity duration-300">
              {/* Head & Neck Posterior */}
              <ellipse cx="150" cy="38" rx="18" ry="24" fill="url(#bodyGradient)" stroke="#334155" strokeWidth="1.5" />
              <path d="M 136 58 C 136 72, 132 78, 128 82 M 164 58 C 164 72, 168 78, 172 82" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Upper Back & Posterior Deltoids */}
              <path
                d="M 128 82
                   C 112 86, 92 98, 78 116
                   C 72 126, 74 140, 76 160
                   C 78 185, 78 215, 74 245
                   C 70 275, 64 305, 62 322
                   L 74 322
                   C 78 285, 86 250, 92 220
                   C 96 200, 96 175, 96 150
                   C 96 135, 106 122, 118 120
                   C 128 118, 142 116, 150 116
                   C 158 116, 172 118, 182 120
                   C 194 122, 204 135, 204 150
                   C 204 175, 204 200, 208 220
                   C 214 250, 222 285, 226 322
                   L 238 322
                   C 236 305, 230 275, 226 245
                   C 222 215, 222 185, 224 160
                   C 226 140, 228 126, 222 116
                   C 208 98, 188 86, 172 82
                   Z"
                fill="url(#bodyGradient)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Lower Back, Glutes & Legs Posterior */}
              <path
                d="M 98 145
                   C 96 175, 104 200, 108 220
                   C 112 245, 106 270, 110 300
                   C 116 340, 114 365, 118 395
                   C 120 410, 116 418, 116 425
                   L 134 425
                   C 136 415, 140 390, 140 360
                   C 140 320, 144 280, 150 260
                   C 156 280, 160 320, 160 360
                   C 160 390, 164 415, 166 425
                   L 184 425
                   C 184 418, 180 410, 182 395
                   C 186 365, 184 340, 190 300
                   C 194 270, 188 245, 192 220
                   C 196 200, 204 175, 202 145
                   C 188 152, 168 155, 150 155
                   C 132 155, 112 152, 98 145
                   Z"
                fill="url(#bodyGradient)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Spine & Scapula Contours */}
              <line x1="150" y1="82" x2="150" y2="225" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M 120 115 C 128 118, 132 135, 126 146" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 180 115 C 172 118, 168 135, 174 146" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Intergluteal Cleft */}
              <line x1="150" y1="220" x2="150" y2="272" stroke="#475569" strokeWidth="2" />
              
              {/* Gluteal Fold (Under-butt crease) */}
              <path d="M 118 280 C 130 286, 144 284, 150 272 C 156 284, 170 286, 182 280" fill="none" stroke="#64748b" strokeWidth="1.5" />

              {/* Popliteal Fossa (Back of Knees) */}
              <line x1="124" y1="352" x2="136" y2="352" stroke="#475569" strokeWidth="1.5" />
              <line x1="164" y1="352" x2="176" y2="352" stroke="#475569" strokeWidth="1.5" />
            </g>
          )}

          {/* ------------------------------------------------------------- */}
          {/* INJECTION SITE HOTSPOTS & KEYBOARD-ACCESSIBLE TARGET PINS */}
          {/* ------------------------------------------------------------- */}
          {visibleSites.map(site => {
            const isLastUsed = site.name === lastUsedSiteName;
            const isSelected = site.name === selectedSiteName;
            const isSuggested = site.name === suggestedSite?.name;

            // Map (x, y) percentages to svg coords (300 x 440)
            const cx = (site.x / 100) * 300;
            const cy = (site.y / 100) * 440;

            let pinStyle = PIN_STYLES.available;
            if (isSelected) {
              pinStyle = PIN_STYLES.selected;
            } else if (isLastUsed) {
              pinStyle = PIN_STYLES.lastUsed;
            } else if (isSuggested) {
              pinStyle = PIN_STYLES.suggested;
            }

            const statusDescription = isSuggested 
              ? 'Suggested Next Spot' 
              : isLastUsed 
              ? 'Last Injected Spot' 
              : isSelected 
              ? 'Currently Selected' 
              : 'Available Spot';

            return (
              <g
                key={site.id}
                tabIndex={interactive ? 0 : -1}
                role={interactive ? 'button' : undefined}
                aria-label={`${site.name} injection site - ${statusDescription}`}
                aria-pressed={isSelected}
                className={interactive ? 'cursor-pointer group outline-none' : ''}
                onClick={() => interactive && onSelectSite && onSelectSite(site.name)}
                onKeyDown={(e) => {
                  if (interactive && onSelectSite && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectSite(site.name);
                  }
                }}
              >
                {/* Keyboard Focus Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="16"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  className="opacity-0 group-focus-visible:opacity-100 transition-opacity"
                />

                {/* Glowing pulsating ring for suggested next site */}
                {isSuggested && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="15"
                    fill="none"
                    stroke={PIN_STYLES.suggested.fill}
                    strokeWidth="2"
                    strokeDasharray="4,2"
                    className="animate-spin-slow"
                  />
                )}

                {/* Outer Target Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="9.5"
                  fill={pinStyle.fill}
                  fillOpacity={isSelected ? '0.95' : '0.8'}
                  stroke={pinStyle.stroke}
                  strokeWidth="2.5"
                  className="transition transform group-hover:scale-125 group-focus-visible:scale-125"
                />

                {/* Inner White Bullseye */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="3"
                  fill="#ffffff"
                />

                {/* Hover Tooltip Label */}
                <title>{site.name} ({statusDescription})</title>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Accessible Interactive Legend & Selection Badges */}
      <div className="flex flex-col gap-2.5 text-[11px] pt-3 border-t border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          
          {/* Suggested Next: Green ring with dashed aura and inner bullseye */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 px-2.5 py-2 rounded-xl">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,1.5" />
              <circle cx="10" cy="10" r="5" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="2" fill="#ffffff" />
            </svg>
            <span className="text-slate-200 font-semibold">{PIN_STYLES.suggested.label}</span>
          </div>

          {/* Last Injected: Solid amber circle with inner white dot */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 px-2.5 py-2 rounded-xl">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="5.5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="2" fill="#ffffff" />
            </svg>
            <span className="text-slate-200 font-semibold">{PIN_STYLES.lastUsed.label}</span>
          </div>

          {/* Available Sites: Solid sky blue circle with inner white dot */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 px-2.5 py-2 rounded-xl">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="5.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="2" fill="#ffffff" />
            </svg>
            <span className="text-slate-200 font-semibold">{PIN_STYLES.available.label}</span>
          </div>

          {/* Selected Target: Solid purple circle with outer glowing ring */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 px-2.5 py-2 rounded-xl">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#c084fc" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="5.5" fill="#a855f7" stroke="#c084fc" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="2" fill="#ffffff" />
            </svg>
            <span className="text-slate-200 font-semibold">{PIN_STYLES.selected.label}</span>
          </div>

        </div>

        {selectedSiteName && (
          <div className="text-purple-300 font-semibold text-xs flex items-center gap-1.5 bg-purple-950/60 border border-purple-800/60 px-3 py-2 rounded-2xl shadow-sm">
            <span>Selected for dose:</span>
            <strong className="text-white font-bold">{selectedSiteName}</strong>
          </div>
        )}
      </div>
    </div>
  );
};
