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
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
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
          {/* ANTERIOR (FRONT) BODY SILHOUETTE */}
          {/* ------------------------------------------------------------- */}
          {currentView === 'front' ? (
            <g className="transition-opacity duration-300">
              {/* Head & Neck */}
              <ellipse cx="150" cy="42" rx="20" ry="26" fill="url(#bodyGradient)" stroke="#334155" strokeWidth="1.5" />
              <path d="M 141 66 L 141 78 Q 141 82 135 84 L 125 86" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 159 66 L 159 78 Q 159 82 165 84 L 175 86" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Torso & Core */}
              <path
                d="M 125 86 
                   C 105 90, 85 105, 82 125 
                   C 80 140, 88 165, 84 200 
                   C 80 230, 68 280, 66 315
                   L 78 315
                   C 82 270, 95 230, 102 210
                   C 105 200, 105 180, 105 160
                   C 105 145, 115 130, 128 128
                   C 135 127, 145 126, 150 126
                   C 155 126, 165 127, 172 128
                   C 185 130, 195 145, 195 160
                   C 195 180, 195 200, 198 210
                   C 205 230, 218 270, 222 315
                   L 234 315
                   C 232 280, 220 230, 216 200
                   C 212 165, 220 140, 218 125
                   C 215 105, 195 90, 175 86
                   Z"
                fill="url(#bodyGradient)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Lower Body & Legs */}
              <path
                d="M 108 200
                   C 108 220, 115 240, 118 270
                   C 122 310, 120 350, 124 395
                   C 125 408, 120 418, 120 425
                   L 136 425
                   C 138 415, 142 390, 142 360
                   C 142 320, 145 280, 150 255
                   C 155 280, 158 320, 158 360
                   C 158 390, 162 415, 164 425
                   L 180 425
                   C 180 418, 175 408, 176 395
                   C 180 350, 178 310, 182 270
                   C 185 240, 192 220, 192 200
                   C 178 220, 165 228, 150 228
                   C 135 228, 122 220, 108 200
                   Z"
                fill="url(#bodyGradient)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Clavicle & Pectoral Muscle Contours */}
              <path d="M 125 96 Q 138 98 150 102 Q 162 98 175 96" fill="none" stroke="#475569" strokeWidth="1.5" />
              <path d="M 112 135 C 122 148, 142 148, 148 140" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 188 135 C 178 148, 158 148, 152 140" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Abdominal Quadrant Line & Umbilicus (Navel) */}
              <line x1="150" y1="140" x2="150" y2="215" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx="150" cy="180" r="3" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              {/* Subtle 2-inch radius exclusion boundary around navel */}
              <circle cx="150" cy="180" r="14" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />

              {/* Patella (Knee Caps) */}
              <ellipse cx="132" cy="335" rx="7" ry="9" fill="none" stroke="#334155" strokeWidth="1.5" />
              <ellipse cx="168" cy="335" rx="7" ry="9" fill="none" stroke="#334155" strokeWidth="1.5" />
            </g>
          ) : (
            /* ------------------------------------------------------------- */
            /* POSTERIOR (BACK) BODY SILHOUETTE */
            /* ------------------------------------------------------------- */
            <g className="transition-opacity duration-300">
              {/* Head & Neck Posterior */}
              <ellipse cx="150" cy="42" rx="20" ry="26" fill="url(#bodyGradient)" stroke="#334155" strokeWidth="1.5" />
              <path d="M 136 62 C 136 78, 130 84, 125 86" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 164 62 C 164 78, 170 84, 175 86" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Back Torso & Gluteus Upper Silhouette */}
              <path
                d="M 125 86 
                   C 105 90, 85 105, 82 125 
                   C 80 140, 88 165, 84 200 
                   C 80 230, 68 280, 66 315
                   L 78 315
                   C 82 270, 95 230, 102 210
                   C 105 200, 105 180, 105 160
                   C 105 145, 115 130, 128 128
                   C 135 127, 145 126, 150 126
                   C 155 126, 165 127, 172 128
                   C 185 130, 195 145, 195 160
                   C 195 180, 195 200, 198 210
                   C 205 230, 218 270, 222 315
                   L 234 315
                   C 232 280, 220 230, 216 200
                   C 212 165, 220 140, 218 125
                   C 215 105, 195 90, 175 86
                   Z"
                fill="url(#bodyGradient)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Gluteal Curvature & Legs */}
              <path
                d="M 108 200
                   C 104 225, 108 255, 116 280
                   C 122 320, 120 355, 124 395
                   C 125 408, 120 418, 120 425
                   L 136 425
                   C 138 415, 142 390, 142 360
                   C 142 320, 146 295, 150 280
                   C 154 295, 158 320, 158 360
                   C 158 390, 162 415, 164 425
                   L 180 425
                   C 180 418, 175 408, 176 395
                   C 180 355, 178 320, 184 280
                   C 192 255, 196 225, 192 200
                   C 178 210, 165 214, 150 214
                   C 135 214, 122 210, 108 200
                   Z"
                fill="url(#bodyGradient)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Spine Line & Scapula (Shoulder Blades) */}
              <line x1="150" y1="86" x2="150" y2="235" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M 120 115 C 130 118, 134 135, 128 148" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 180 115 C 170 118, 166 135, 172 148" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Gluteus Maximus Intergluteal Cleft */}
              <line x1="150" y1="230" x2="150" y2="278" stroke="#475569" strokeWidth="2" />
              
              {/* Gluteal Subcutaneous Fold (Under-butt crease) */}
              <path d="M 126 288 C 135 294, 146 292, 150 278" fill="none" stroke="#64748b" strokeWidth="1.5" />
              <path d="M 174 288 C 165 294, 154 292, 150 278" fill="none" stroke="#64748b" strokeWidth="1.5" />

              {/* Hamstring Contours */}
              <path d="M 132 300 C 130 325, 130 345, 134 358" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 168 300 C 170 325, 170 345, 166 358" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Popliteal Fossa (Back of Knees) */}
              <line x1="126" y1="358" x2="138" y2="358" stroke="#475569" strokeWidth="1.5" />
              <line x1="162" y1="358" x2="174" y2="358" stroke="#475569" strokeWidth="1.5" />
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
