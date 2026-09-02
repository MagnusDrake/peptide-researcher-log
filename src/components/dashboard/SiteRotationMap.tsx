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
        <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => setCurrentView('front')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === 'front'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Front (Anterior & Abdomen)</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('back')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === 'back'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Back (Posterior & Glutes)</span>
          </button>
        </div>
      </div>

      {/* Realistic Human Anatomical Silhouette SVG & Target Markers */}
      <div className="relative w-full max-w-sm mx-auto flex items-center justify-center py-2 select-none">
        <svg
          viewBox="0 0 300 440"
          className="w-full max-h-[390px] drop-shadow-2xl"
        >
          <defs>
            {/* Blueprint Grid */}
            <pattern id="bodyGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>

            {/* Shading Gradients for 3D Muscle Depth */}
            <linearGradient id="skinGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="45%" stopColor="#172233" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="skinGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#1a2538" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="gluteHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background Grid Accent */}
          <rect width="300" height="440" fill="url(#bodyGrid)" rx="20" />

          {/* ------------------------------------------------------------- */}
          {/* FRONT VIEW (ANTERIOR): Realistic Human Musculature */}
          {/* ------------------------------------------------------------- */}
          {currentView === 'front' && (
            <g id="front-anatomy">
              {/* Outer Body Silhouette */}
              <path
                d="
                  M 150 20
                  C 162 20, 170 30, 170 45
                  C 170 60, 162 70, 158 74
                  C 165 77, 182 82, 198 90
                  C 214 98, 222 108, 224 125
                  C 226 142, 222 170, 220 200
                  C 218 220, 214 235, 208 238
                  C 204 237, 200 220, 198 198
                  C 195 165, 192 145, 190 135
                  C 188 155, 185 180, 182 205
                  C 180 225, 182 245, 185 260
                  C 188 275, 190 295, 186 325
                  C 182 355, 176 385, 172 415
                  C 170 422, 162 422, 160 415
                  C 156 385, 152 350, 151 315
                  C 150 295, 150 270, 150 262
                  C 150 270, 150 295, 149 315
                  C 148 350, 144 385, 140 415
                  C 138 422, 130 422, 128 415
                  C 124 385, 118 355, 114 325
                  C 110 295, 112 275, 115 260
                  C 118 245, 120 225, 118 205
                  C 115 180, 112 155, 110 135
                  C 108 145, 105 165, 102 198
                  C 100 220, 96 237, 92 238
                  C 86 235, 82 220, 80 200
                  C 78 170, 74 142, 76 125
                  C 78 108, 86 98, 102 90
                  C 118 82, 135 77, 142 74
                  C 138 70, 130 60, 130 45
                  C 130 30, 138 20, 150 20
                  Z
                "
                fill="url(#skinGradFront)"
                stroke="#38bdf8"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Clavicles (Collarbones) */}
              <path d="M 150 78 C 165 78, 185 84, 198 90" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 150 78 C 135 78, 115 84, 102 90" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

              {/* Pectoral Chest Contours */}
              <path d="M 150 102 C 165 102, 186 108, 190 125 C 185 142, 165 145, 150 144" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 150 102 C 135 102, 114 108, 110 125 C 115 142, 135 145, 150 144" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />

              {/* Sternum / Midline */}
              <line x1="150" y1="80" x2="150" y2="150" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,3" />

              {/* Abdominal Core Contours (4 SubQ Quadrants Surrounding Navel) */}
              <rect x="132" y="160" width="36" height="52" rx="10" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
              {/* Vertical Linea Alba */}
              <line x1="150" y1="150" x2="150" y2="235" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1.5" />
              {/* Horizontal Transverse Abdominal Division */}
              <line x1="130" y1="188" x2="170" y2="188" stroke="#38bdf8" strokeOpacity="0.2" strokeWidth="1" />

              {/* Umbilicus (Navel) */}
              <circle cx="150" cy="188" r="3.5" fill="#38bdf8" fillOpacity="0.6" stroke="#0284c7" strokeWidth="1" />
              <circle cx="150" cy="188" r="1.5" fill="#0f172a" />

              {/* Inguinal Crease (V-Lines) */}
              <path d="M 125 220 C 135 235, 145 248, 150 252" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 175 220 C 165 235, 155 248, 150 252" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Quadriceps (Thigh) Muscle Contours */}
              <path d="M 124 270 C 122 300, 126 335, 134 350" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 176 270 C 178 300, 174 335, 166 350" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Knee Caps */}
              <ellipse cx="132" cy="355" rx="6" ry="7" fill="none" stroke="#475569" strokeWidth="1" />
              <ellipse cx="168" cy="355" rx="6" ry="7" fill="none" stroke="#475569" strokeWidth="1" />
            </g>
          )}

          {/* ------------------------------------------------------------- */}
          {/* BACK VIEW (POSTERIOR): Human Gluteal & Latissimus Musculature */}
          {/* ------------------------------------------------------------- */}
          {currentView === 'back' && (
            <g id="back-anatomy">
              {/* Outer Body Silhouette (Back View with defined Gluteal Curvature) */}
              <path
                d="
                  M 150 20
                  C 162 20, 170 30, 170 45
                  C 170 60, 162 70, 158 74
                  C 165 77, 182 82, 198 90
                  C 214 98, 222 108, 224 125
                  C 226 142, 222 170, 220 200
                  C 218 220, 214 235, 208 238
                  C 204 237, 200 220, 198 198
                  C 195 165, 192 145, 190 135
                  C 188 155, 184 175, 180 195
                  C 178 210, 185 220, 190 235
                  C 195 250, 194 275, 188 295
                  C 184 315, 188 335, 184 365
                  C 180 395, 175 415, 172 418
                  C 170 422, 162 422, 160 415
                  C 156 385, 153 350, 152 315
                  C 151 295, 150 275, 150 262
                  C 150 275, 149 295, 148 315
                  C 147 350, 144 385, 140 415
                  C 138 422, 130 422, 128 418
                  C 124 385, 116 365, 112 335
                  C 116 315, 112 295, 106 275
                  C 105 250, 110 235, 115 220
                  C 120 210, 116 195, 112 175
                  C 110 155, 108 145, 110 135
                  C 108 145, 105 165, 102 198
                  C 100 220, 96 237, 92 238
                  C 86 235, 82 220, 80 200
                  C 78 170, 74 142, 76 125
                  C 78 108, 86 98, 102 90
                  C 118 82, 135 77, 142 74
                  C 138 70, 130 60, 130 45
                  C 130 30, 138 20, 150 20
                  Z
                "
                fill="url(#skinGradBack)"
                stroke="#a855f7"
                strokeOpacity="0.45"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Trapezius & Upper Back Diamond */}
              <path d="M 150 68 L 168 95 L 150 130 L 132 95 Z" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Scapular Shoulder Blades */}
              <path d="M 175 105 C 185 115, 185 135, 175 145" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 125 105 C 115 115, 115 135, 125 145" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />

              {/* Spine / Vertebral Furrow */}
              <line x1="150" y1="70" x2="150" y2="230" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />

              {/* Latissimus Dorsi (V-Taper) Contours */}
              <path d="M 188 135 C 175 155, 162 175, 150 190" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 112 135 C 125 155, 138 175, 150 190" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* Lower Back Lumbar & Flanks (Love Handle SubQ Regions) */}
              <path d="M 120 195 C 125 210, 135 220, 142 225" fill="none" stroke="#334155" strokeWidth="1.5" />
              <path d="M 180 195 C 175 210, 165 220, 158 225" fill="none" stroke="#334155" strokeWidth="1.5" />

              {/* ============================================================== */}
              {/* 🍑 GLUTEAL REGION (Anatomical Gluteus Maximus & Ventrogluteal) */}
              {/* ============================================================== */}
              {/* Left Gluteus Maximus Cheek */}
              <path
                d="
                  M 150 230
                  C 138 225, 118 232, 114 248
                  C 110 265, 118 285, 135 292
                  C 144 295, 150 285, 150 270
                  Z
                "
                fill="url(#gluteHighlight)"
                stroke="#c084fc"
                strokeOpacity="0.6"
                strokeWidth="1.75"
              />

              {/* Right Gluteus Maximus Cheek */}
              <path
                d="
                  M 150 230
                  C 162 225, 182 232, 186 248
                  C 190 265, 182 285, 165 292
                  C 156 295, 150 285, 150 270
                  Z
                "
                fill="url(#gluteHighlight)"
                stroke="#c084fc"
                strokeOpacity="0.6"
                strokeWidth="1.75"
              />

              {/* Intergluteal Cleft (Center crease) */}
              <path d="M 150 230 L 150 278" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />

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
          {/* INJECTION SITE HOTSPOTS & INTERACTIVE TARGET PINS */}
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

            return (
              <g
                key={site.id}
                className={interactive ? 'cursor-pointer group' : ''}
                onClick={() => interactive && onSelectSite && onSelectSite(site.name)}
              >
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
                  className="transition transform group-hover:scale-125"
                />

                {/* Inner White Bullseye */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="3"
                  fill="#ffffff"
                />

                {/* Hover Tooltip Label */}
                <title>{site.name}</title>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Selection Badges */}
      <div className="flex flex-col gap-2.5 text-[11px] pt-3 border-t border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1.5 rounded-xl">
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: PIN_STYLES.suggested.fill, boxShadow: `0 0 0 2px ${PIN_STYLES.suggested.glow}` }}
            />
            <span className="text-slate-300 font-medium">{PIN_STYLES.suggested.label}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1.5 rounded-xl">
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: PIN_STYLES.lastUsed.fill, boxShadow: `0 0 0 2px ${PIN_STYLES.lastUsed.glow}` }}
            />
            <span className="text-slate-300 font-medium">{PIN_STYLES.lastUsed.label}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1.5 rounded-xl">
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: PIN_STYLES.available.fill, boxShadow: `0 0 0 2px ${PIN_STYLES.available.glow}` }}
            />
            <span className="text-slate-300 font-medium">{PIN_STYLES.available.label}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1.5 rounded-xl">
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: PIN_STYLES.selected.fill, boxShadow: `0 0 0 2px ${PIN_STYLES.selected.glow}` }}
            />
            <span className="text-slate-300 font-medium">{PIN_STYLES.selected.label}</span>
          </div>
        </div>

        {selectedSiteName && (
          <div className="text-purple-300 font-semibold text-xs flex items-center gap-1.5 bg-purple-950/60 border border-purple-800/60 px-3 py-1.5 rounded-xl">
            <span>Selected for dose:</span>
            <strong className="text-white">{selectedSiteName}</strong>
          </div>
        )}
      </div>
    </div>
  );
};
